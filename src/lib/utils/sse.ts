/**
 * SSE (Server-Sent Events) 工具类
 * 用于处理服务端推送的流式数据
 */

import type { SSEResponse, AIMessageMetadata } from '@/lib/types/chat'

/** SSE消息数据 */
export interface SSEMessageData {
  /** AI回复的文本内容 */
  text: string
  /** AI消息的元数据 */
  metadata?: AIMessageMetadata
  /** AI思考过程（从<think></think>标签中提取） */
  thinkingProcess?: string
}

export interface SSEOptions {
  /** 接收到消息时的回调 */
  onMessage?: (data: SSEMessageData) => void
  /** 发生错误时的回调 */
  onError?: (error: Error) => void
  /** 连接打开时的回调 */
  onOpen?: () => void
  /** 连接关闭时的回调 */
  onClose?: () => void
}

export class SSEClient {
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  private controller: AbortController | null = null
  private buffer: string = '' // 用于缓存不完整的消息
  private lastReceivedText: string = '' // 跟踪最后接收到的完整文本，用于计算增量
  private jsonBuffer: string = '' // 用于缓存不完整的JSON对象

  /**
   * 连接到SSE端点
   * @param url SSE端点URL
   * @param body 请求体
   * @param options 回调选项
   */
  async connect(url: string, body: any, options: SSEOptions = {}) {
    this.controller = new AbortController()
    this.buffer = '' // 重置缓冲区
    this.jsonBuffer = '' // 重置JSON缓冲区
    this.lastReceivedText = '' // 重置最后接收的文本

    try {
      // 准备请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      }
      
      // 添加JWT token到Authorization header（仅在客户端环境）
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        console.log('[SSE] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null')
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
          console.log('[SSE] Added Authorization header:', `Bearer ${token.substring(0, 20)}...`)
        } else {
          console.warn('[SSE] No token found in localStorage')
        }
      } else {
        console.warn('[SSE] Running in server environment, no token added')
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        signal: this.controller.signal,
        // 不再需要 credentials: 'include'，JWT通过Authorization header传递
      })

      if (!response.ok) {
        // 处理不同类型的错误
        if (response.status === 401) {
          // 401 Unauthorized - 用户未登录或 session 无效
          throw new Error('UNAUTHORIZED: 请先登录后再发送消息')
        } else if (response.status === 403) {
          // 403 Forbidden - 权限不足
          throw new Error('FORBIDDEN: 权限不足')
        } else if (response.status === 404) {
          // 404 Not Found - 资源不存在
          throw new Error(`NOT_FOUND: 资源不存在`)
        } else {
          // 其他错误
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      options.onOpen?.()

      const stream = response.body
      if (!stream) {
        throw new Error('Response body is null')
      }

      this.reader = stream.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await this.reader.read()
        
        if (done) {
          options.onClose?.()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        
        // 将新数据追加到缓冲区
        this.buffer += chunk
        
        while (true) {
          const rnIndex = this.buffer.indexOf('\r\n\r\n')
          const nnIndex = this.buffer.indexOf('\n\n')
          const rrIndex = this.buffer.indexOf('\r\r')

          let eventEndIndex = -1
          let delimiterLength = 0

          if (rnIndex !== -1 && (eventEndIndex === -1 || rnIndex < eventEndIndex)) {
            eventEndIndex = rnIndex
            delimiterLength = 4
          }

          if (nnIndex !== -1 && (eventEndIndex === -1 || nnIndex < eventEndIndex)) {
            eventEndIndex = nnIndex
            delimiterLength = 2
          }

          if (rrIndex !== -1 && (eventEndIndex === -1 || rrIndex < eventEndIndex)) {
            eventEndIndex = rrIndex
            delimiterLength = 2
          }

          if (eventEndIndex === -1) {
            break
          }

          const rawEvent = this.buffer.slice(0, eventEndIndex)
          this.buffer = this.buffer.slice(eventEndIndex + delimiterLength)

          if (!rawEvent) {
            continue
          }

          const normalizedEvent = rawEvent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

          const eventLines = normalizedEvent.split('\n')
          const dataParts: string[] = []

          for (const line of eventLines) {
            if (line.startsWith('data:')) {
              let value = line.slice(5)
              if (value.startsWith(' ')) {
                value = value.slice(1)
              }
              // 处理可能包含换行符的数据
              dataParts.push(value)
            } else if (line.startsWith(':')) {
              // Comment line per SSE spec, ignore
              continue
            } else if (line.length > 0) {
              // 只添加非空行（避免额外的空行干扰）
              dataParts.push(line)
            }
          }

          // 按SSE规范，将同一事件内的多行 data: 按原样用换行拼接，保留所有内容与换行
          const combinedData = dataParts.join('\n')

          if (combinedData.length === 0) {
            continue
          }

          // 添加调试日志来查看接收到的原始数据
          if (process.env.NODE_ENV === 'development') {
            console.log('[SSE] Received raw data:', {
              dataParts: dataParts,
              combinedData: combinedData.substring(0, 200),
              dataLength: combinedData.length,
              isJSON: combinedData.trim().startsWith('{'),
              isPlainText: !combinedData.trim().startsWith('{') && !combinedData.trim().startsWith('[')
            })
          }

          // 检查是否为控制消息（如 [DONE]），但不影响空白字符的传递
          const trimmedForControl = combinedData.trim()

          if (trimmedForControl === '[DONE]') {
            options.onClose?.()
            this.close()
            return
          }

          // 处理可能包含多个连续JSON对象的数据
          this.parseMultipleJSONObjects(combinedData, options)
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        options.onError?.(error)
      }
    }
  }

  /**
   * 解析可能包含多个连续JSON对象的数据
   * @param data 可能包含多个JSON对象的字符串
   * @param options 回调选项
   */
  private parseMultipleJSONObjects(data: string, options: SSEOptions) {
    // 将数据追加到JSON缓冲区
    this.jsonBuffer += data
    
    // 检查是否为纯文本数据（不是JSON格式）
    const trimmedBuffer = this.jsonBuffer.trim()
    if (trimmedBuffer && !trimmedBuffer.startsWith('{') && !trimmedBuffer.startsWith('[')) {
      // 这是纯文本数据，直接处理（保留原始内容，不使用trimmed版本）
      this.handlePlainText(this.jsonBuffer, options)
      this.jsonBuffer = '' // 清空缓冲区
      return
    }
    
    // 尝试解析所有完整的JSON对象
    while (this.jsonBuffer.length > 0) {
      let jsonStart = -1
      let jsonEnd = -1
      let braceCount = 0
      
      // 查找第一个完整的JSON对象
      for (let i = 0; i < this.jsonBuffer.length; i++) {
        const char = this.jsonBuffer[i]
        
        if (char === '{') {
          if (jsonStart === -1) {
            jsonStart = i
          }
          braceCount++
        } else if (char === '}') {
          braceCount--
          if (braceCount === 0 && jsonStart !== -1) {
            jsonEnd = i
            break
          }
        }
      }
      
      // 如果找到了完整的JSON对象
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = this.jsonBuffer.substring(jsonStart, jsonEnd + 1)
        this.jsonBuffer = this.jsonBuffer.substring(jsonEnd + 1)
        
        try {
          this.parseSingleJSONObject(jsonStr, options)
        } catch (error) {
          console.warn('[SSE] Failed to parse JSON object:', error, 'JSON:', jsonStr.substring(0, 100))
        }
      } else {
        // 没有找到完整的JSON对象，等待更多数据
        // 但是如果缓冲区太大，可能是数据有问题，清空缓冲区
        if (this.jsonBuffer.length > 100000) {
          console.warn('[SSE] JSON buffer too large, clearing:', this.jsonBuffer.length)
          this.jsonBuffer = ''
        }
        break
      }
    }
  }

  /**
   * 处理纯文本数据（非JSON格式）
   * @param text 纯文本内容
   * @param options 回调选项
   */
  private handlePlainText(text: string, options: SSEOptions) {
    // 直接将文本作为增量内容处理，保留所有字符（包括空白字符）
    if (text !== undefined && text !== null) {
      // 累积文本内容
      this.lastReceivedText += text
      
      // 调用回调，传递文本增量（保留原始内容）
      options.onMessage?.({
        text: text,
        metadata: undefined,
        thinkingProcess: undefined
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Handled plain text:', {
          textLength: text.length,
          textPreview: text.substring(0, 100),
          totalLength: this.lastReceivedText.length,
          rawText: JSON.stringify(text.substring(0, 50)) // 显示原始字符串
        })
      }
    }
  }

  /**
   * 解析单个JSON对象并提取数据
   * @param jsonStr JSON字符串
   * @param options 回调选项
   */
  private parseSingleJSONObject(jsonStr: string, options: SSEOptions) {
    let sseResponse: SSEResponse
    
    try {
      sseResponse = JSON.parse(jsonStr)
    } catch (error) {
      // JSON解析失败，可能是纯文本数据，尝试作为文本处理
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SSE] Failed to parse JSON, treating as plain text:', error, 'Text preview:', jsonStr.substring(0, 200))
      }
      // 直接作为纯文本处理
      this.handlePlainText(jsonStr, options)
      return
    }
    
    // 提取AI回复的文本 - 只从指定的路径提取，绝不显示整个JSON
    let extractedText = ''
    
    // 从SSEResponse中提取文本内容的辅助函数
    const extractTextFromResponse = (response: SSEResponse): string => {
      // 路径0: 直接的 result.output.text（后端实际格式）
      if ((response as any).result?.output?.text !== undefined) {
        const textValue = (response as any).result.output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }

      // 路径0.1: 直接的 results[0].output.text（后端实际格式）
      if ((response as any).results?.[0]?.output?.text !== undefined) {
        const textValue = (response as any).results[0].output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      // 路径1: chatResponse.result.output.text（原有格式，保持兼容）
      if (response.chatResponse?.result?.output?.text !== undefined) {
        const textValue = response.chatResponse.result.output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      // 路径2: chatResponse.results[0].output.text
      if (response.chatResponse?.results?.[0]?.output?.text !== undefined) {
        const textValue = response.chatResponse.results[0].output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      // 路径3: 直接查找text字段（备用，但不常见）
      if ((response as any).text !== undefined) {
        const textValue = (response as any).text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      // 路径4: 检查是否为纯文本数据（新增，用于处理data:+内容格式）
      if (typeof response === 'string') {
        return response
      }
      
      // 如果所有路径都无法提取有效文本，返回空字符串
      return ''
    }
    
    // 提取文本内容
    extractedText = extractTextFromResponse(sseResponse)
    
    // 确保 extractedText 是字符串
    if (typeof extractedText !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SSE] extractedText is not a string:', typeof extractedText, extractedText)
      }
      extractedText = ''
    }
    
    // 开发环境调试：记录提取的文本
    if (process.env.NODE_ENV === 'development') {
      const resultText = sseResponse.chatResponse?.result?.output?.text
      const resultsText = sseResponse.chatResponse?.results?.[0]?.output?.text
      console.log('[SSE] Extracted text:', {
        extractedText: typeof extractedText === 'string' ? extractedText.substring(0, 100) : String(extractedText),
        extractedTextType: typeof extractedText,
        isJSON: typeof extractedText === 'string' && extractedText.trim().startsWith('{'),
        hasChatResponse: !!sseResponse.chatResponse,
        hasResult: !!sseResponse.chatResponse?.result,
        hasResults: !!sseResponse.chatResponse?.results,
        resultTextType: typeof resultText,
        resultText: typeof resultText === 'string' ? resultText.substring(0, 50) : String(resultText),
        resultsTextType: typeof resultsText,
        resultsText: typeof resultsText === 'string' ? resultsText.substring(0, 50) : String(resultsText)
      })
    }
    
    // 确保提取的文本是字符串类型
    if (extractedText && typeof extractedText !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SSE] extractedText is not a string, converting:', typeof extractedText)
      }
      extractedText = String(extractedText)
    }
    
    // 使用提取的文本作为当前文本，确保是字符串类型
    let currentText = ''
    if (extractedText !== undefined && extractedText !== null) {
      if (typeof extractedText === 'string') {
        currentText = extractedText
      } else if (typeof extractedText === 'object') {
        // 如果是对象，不处理（避免显示 [object Object]）
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SSE] extractedText is an object, ignoring it:', extractedText)
        }
        currentText = ''
      } else {
        currentText = String(extractedText)
      }
    }
    
    // 确保 currentText 是字符串
    currentText = typeof currentText === 'string' ? currentText : ''
    
    // 根据用户提供的示例，后端发送的text字段是增量文本片段
    // 例如：第一个JSON是"<th"，第二个是"ink"，第三个是">\n好的"
    // 我们需要将这些片段组合起来并实时显示
    let textIncrement = ''
    
    // 检查是否有有效的文本内容（排除空字符串和JSON字符串）
    // 注意：不排除单独的 '-'，因为列表项可能以 '-' 开头
    const hasValidText = currentText && 
                        typeof currentText === 'string' &&
                        currentText !== '' && 
                        !(currentText.trim().startsWith('{') && currentText.trim().endsWith('}') && currentText.trim().length > 10)
    
    if (hasValidText) {
      if (this.lastReceivedText === '') {
        // 第一次接收到文本，直接使用
        textIncrement = currentText
        this.lastReceivedText = currentText
      } else {
        // 判断文本格式：累积文本 vs 增量文本
        // 情况1: 累积文本 - 当前文本包含所有之前的文本（长度更长且以之前文本开头）
        if (currentText.length > this.lastReceivedText.length && 
            currentText.startsWith(this.lastReceivedText)) {
          // 累积文本：提取增量部分
          textIncrement = currentText.substring(this.lastReceivedText.length)
          this.lastReceivedText = currentText
        }
        // 情况2: 增量文本 - 当前文本是新增的片段（不包含之前的文本）
        else if (currentText !== this.lastReceivedText) {
          // 增量文本：直接使用，并累积到lastReceivedText
          textIncrement = currentText
          this.lastReceivedText += currentText
        }
        // 情况3: 文本相同，可能是重复发送，跳过
        else {
          textIncrement = ''
        }
      }
    }
    // 如果没有text字段（undefined/null），textIncrement保持为空字符串
    
    // 提取元数据
    const metadata: AIMessageMetadata = {}
    
    // 提取工具调用信息
    const toolCalls = (sseResponse as any).result?.output?.toolCalls || 
                     (sseResponse as any).results?.[0]?.output?.toolCalls ||
                     sseResponse.chatResponse?.result?.output?.toolCalls || 
                     sseResponse.chatResponse?.results?.[0]?.output?.toolCalls
    if (toolCalls && toolCalls.length > 0) {
      metadata.toolCalls = toolCalls.map((tc: any) => {
        // 判断工具调用状态
        // 优先级：failed > completed > calling > pending
        let status: 'pending' | 'calling' | 'completed' | 'failed' = 'pending'
        
        if (tc.error || tc.status === 'failed') {
          status = 'failed'
        } else if (tc.result !== undefined && tc.result !== null) {
          status = 'completed'
        } else if (tc.status === 'calling' || tc.status === 'running') {
          status = 'calling'
        } else if (tc.status === 'completed' || tc.status === 'success') {
          status = 'completed'
        } else if (tc.name || tc.function?.name) {
          // 如果有名称和参数但没有结果，通常表示正在调用
          // 但如果也没有参数，可能是pending状态
          status = (tc.arguments || tc.function?.arguments) ? 'calling' : 'pending'
        }
        
        // 提取工具名称
        const toolName = tc.name || tc.function?.name || tc.toolName || 'unknown'
        
        // 提取参数
        let toolArgs = ''
        if (tc.arguments) {
          toolArgs = typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments, null, 2)
        } else if (tc.function?.arguments) {
          toolArgs = typeof tc.function.arguments === 'string' ? tc.function.arguments : JSON.stringify(tc.function.arguments, null, 2)
        } else if (tc.input) {
          toolArgs = typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input, null, 2)
        }
        
        // 提取结果
        let toolResult: string | undefined = undefined
        if (tc.result !== undefined && tc.result !== null) {
          toolResult = typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result, null, 2)
        } else if (tc.output !== undefined && tc.output !== null) {
          toolResult = typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output, null, 2)
        }
        
        // 提取错误信息
        const errorMsg = tc.error || tc.errorMessage || tc.err || undefined
        
        return {
          id: tc.id || tc.callId || tc.toolCallId,
          name: toolName,
          arguments: toolArgs,
          result: toolResult,
          status,
          error: errorMsg
        }
      })
    }
    
    // 提取RAG检索文档
    const retrievedDocs = sseResponse.context?.qa_retrieved_documents
    if (retrievedDocs && retrievedDocs.length > 0) {
      metadata.retrievedDocuments = retrievedDocs.map(doc => ({
        id: doc.id,
        content: doc.content || '',
        score: doc.score,
        source: doc.source
      }))
    }
    
    // 提取其他元数据
    const chatMetadata = sseResponse.chatResponse?.metadata
    if (chatMetadata) {
      metadata.modelId = chatMetadata.model
      metadata.finishReason = sseResponse.chatResponse?.result?.metadata?.finishReason
      
      if (chatMetadata.usage) {
        metadata.usage = {
          promptTokens: chatMetadata.usage.promptTokens,
          completionTokens: chatMetadata.usage.completionTokens,
          totalTokens: chatMetadata.usage.totalTokens
        }
      }
    }
    
    // 只要有文本增量或元数据，就调用回调
    // 注意：即使textIncrement为空字符串，如果metadata有更新（如工具调用状态变化），也应该发送
    const hasMetadata = Object.keys(metadata).length > 0
    
    // 确保 textIncrement 是字符串类型
    if (textIncrement !== undefined && textIncrement !== null && typeof textIncrement !== 'string') {
      // 如果不是字符串，转换为字符串或清空
      if (typeof textIncrement === 'object') {
        // 对象不能直接转换为文本，清空
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SSE] textIncrement is an object, clearing it:', textIncrement)
        }
        textIncrement = ''
      } else {
        textIncrement = String(textIncrement)
      }
    }
    
    // 确保 textIncrement 是字符串
    const textIncrementStr = typeof textIncrement === 'string' ? textIncrement : ''
    
    // 只有当textIncrement有实际内容时才认为有文本增量（过滤掉空字符串）
    // 不过滤任何看起来像代码或JSON的内容，因为这些可能是有效的回复内容
    const hasTextIncrement = textIncrementStr !== undefined && 
                             textIncrementStr !== null && 
                             textIncrementStr !== '' && 
                             typeof textIncrementStr === 'string'
    
    // 直接使用文本内容，不进行JSON过滤
    let safeText = ''
    if (hasTextIncrement) {
      safeText = textIncrementStr
    }
    
    // 确保 safeText 始终是字符串
    safeText = typeof safeText === 'string' ? safeText : ''
    
    // 处理思考过程：从完整文本中提取 <think></think> 标签内容
    let thinkingProcess = ''
    let displayText = safeText
    
    if (safeText) {
      // 检查是否包含 <think> 标签
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g
      const matches = [...this.lastReceivedText.matchAll(thinkRegex)]
      
      if (matches.length > 0) {
        // 提取所有思考过程内容
        thinkingProcess = matches.map(match => match[1]).join('\n\n')
        
        // 从显示文本中移除 <think></think> 标签及其内容
        displayText = safeText.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      }
      
      // 处理工具调用标签：保护 <tool_call> 标签不被Markdown解析器处理
      // 将 <tool_call> 和 </tool_call> 替换为代码块格式，保持内容完整显示
      displayText = displayText.replace(/<tool_call>/g, '```\n<tool_call>')
      displayText = displayText.replace(/<\/tool_call>/g, '</tool_call>\n```')
      
      // 处理其他可能的工具调用相关标签
      displayText = displayText.replace(/<arg_key>/g, '<arg_key>')
      displayText = displayText.replace(/<\/arg_key>/g, '</arg_key>')
      displayText = displayText.replace(/<arg_value>/g, '<arg_value>')
      displayText = displayText.replace(/<\/arg_value>/g, '</arg_value>')
      
      // 特别处理JSON代码块，确保完整显示
      // 如果内容包含```json但没有结束标记，不要截断
      if (displayText.includes('```json') && !displayText.includes('```\n\n') && !displayText.endsWith('```')) {
        // JSON代码块可能还在流式传输中，保持原样
      }
    }
    
    // 只有在有有效文本增量或元数据时才调用回调
    // 重要：如果displayText为空，即使有元数据，也要确保不会传递任何JSON字符串
    if (displayText || hasMetadata || thinkingProcess) {
      options.onMessage?.({
        text: String(displayText), // 强制转换为字符串，确保绝对不是对象
        thinkingProcess: thinkingProcess || undefined,
        metadata: hasMetadata ? metadata : undefined
      })
      
      // 开发环境下输出调试信息
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Parsed JSON object:', { 
          textIncrement: safeText ? safeText.substring(0, 100) : '(empty)',
          textIncrementLength: safeText?.length || 0,
          totalTextLength: this.lastReceivedText.length,
          totalTextPreview: this.lastReceivedText.substring(0, 100),
          hasMetadata,
          metadataKeys: Object.keys(metadata),
          originalTextWasJSON: textIncrement && textIncrement.trim().startsWith('{')
        })
      }
    } else {
      // 如果没有有效文本也没有元数据，记录但不传递任何内容
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] No valid text or metadata extracted from JSON, skipping message')
      }
    }
  }

  /**
   * 关闭SSE连接
   */
  close() {
    if (this.reader) {
      this.reader.cancel()
      this.reader = null
    }
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }
    // 重置状态
    this.jsonBuffer = ''
    this.lastReceivedText = ''
  }
}

