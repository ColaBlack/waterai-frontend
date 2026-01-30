import type { SSEResponse, AIMessageMetadata } from '@/lib/types/chat'

export interface SSEMessageData {
  text: string
  metadata?: AIMessageMetadata
  thinkingProcess?: string
}

export interface SSEOptions {
  onMessage?: (data: SSEMessageData) => void
  onError?: (error: Error) => void
  onOpen?: () => void
  onClose?: () => void
}

export class SSEClient {
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  private controller: AbortController | null = null
  private buffer: string = ''
  private lastReceivedText: string = ''
  private jsonBuffer: string = ''

  async connect(url: string, body: any, options: SSEOptions = {}) {
    this.controller = new AbortController()
    this.buffer = ''
    this.jsonBuffer = ''
    this.lastReceivedText = ''

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      }
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        signal: this.controller.signal,
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED: 请先登录后再发送消息')
        } else if (response.status === 403) {
          throw new Error('FORBIDDEN: 权限不足')
        } else if (response.status === 404) {
          throw new Error(`NOT_FOUND: 资源不存在`)
        } else {
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
          let eventName: string | undefined = undefined

          for (const line of eventLines) {
            if (line.startsWith('event:')) {
              let value = line.slice(6)
              if (value.startsWith(' ')) {
                value = value.slice(1)
              }
              eventName = value.trim()
            } else if (line.startsWith('data:')) {
              let value = line.slice(5)
              if (value.startsWith(' ')) {
                value = value.slice(1)
              }
              dataParts.push(value)
            } else if (line.startsWith(':')) {
              continue
            } else if (line.length > 0) {
              dataParts.push(line)
            }
          }

          const combinedData = dataParts.join('\n')

          if (combinedData.length === 0) {
            continue
          }

          const trimmedForControl = combinedData.trim()

          if (trimmedForControl === '[DONE]') {
            options.onClose?.()
            this.close()
            return
          }

          this.parseMultipleJSONObjects(combinedData, options, eventName)
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        options.onError?.(error)
      }
    }
  }

  private parseMultipleJSONObjects(data: string, options: SSEOptions, eventName?: string) {
    this.jsonBuffer += data
    
    const trimmedBuffer = this.jsonBuffer.trim()
    if (trimmedBuffer && !trimmedBuffer.startsWith('{') && !trimmedBuffer.startsWith('[')) {
      this.handlePlainText(this.jsonBuffer, options, eventName)
      this.jsonBuffer = ''
      return
    }
    
    while (this.jsonBuffer.length > 0) {
      let jsonStart = -1
      let jsonEnd = -1
      let braceCount = 0
      
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
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = this.jsonBuffer.substring(jsonStart, jsonEnd + 1)
        this.jsonBuffer = this.jsonBuffer.substring(jsonEnd + 1)
        
        try {
          this.parseSingleJSONObject(jsonStr, options, eventName)
        } catch (error) {
        }
      } else {
        if (this.jsonBuffer.length > 100000) {
          this.jsonBuffer = ''
        }
        break
      }
    }
  }

  private handlePlainText(text: string, options: SSEOptions, eventName?: string) {
    if (text !== undefined && text !== null && text.length > 0) {
      this.lastReceivedText += text
      
      options.onMessage?.({
        text: text,
        metadata: undefined,
        thinkingProcess: undefined
      })
    }
  }

  private parseSingleJSONObject(jsonStr: string, options: SSEOptions, eventName?: string) {
    let sseResponse: SSEResponse
    
    try {
      sseResponse = JSON.parse(jsonStr)
    } catch (error) {
      this.handlePlainText(jsonStr, options, eventName)
      return
    }
    
    let extractedText = ''
    
    const extractTextFromResponse = (response: SSEResponse): string => {
      if ((response as any).result?.output?.text !== undefined) {
        const textValue = (response as any).result.output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }

      if ((response as any).results?.[0]?.output?.text !== undefined) {
        const textValue = (response as any).results[0].output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      if (response.chatResponse?.result?.output?.text !== undefined) {
        const textValue = response.chatResponse.result.output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      if (response.chatResponse?.results?.[0]?.output?.text !== undefined) {
        const textValue = response.chatResponse.results[0].output.text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      if ((response as any).text !== undefined) {
        const textValue = (response as any).text
        if (textValue !== undefined && textValue !== null && typeof textValue === 'string') {
          return textValue
        }
      }
      
      if (typeof response === 'string') {
        return response
      }
      
      return ''
    }
    
    extractedText = extractTextFromResponse(sseResponse)
    
    if (typeof extractedText !== 'string') {
      extractedText = ''
    }
    
    if (extractedText && typeof extractedText !== 'string') {
      extractedText = String(extractedText)
    }
    
    let currentText = ''
    if (extractedText !== undefined && extractedText !== null) {
      if (typeof extractedText === 'string') {
        currentText = extractedText
      } else if (typeof extractedText === 'object') {
        currentText = ''
      } else {
        currentText = String(extractedText)
      }
    }
    
    currentText = typeof currentText === 'string' ? currentText : ''
    
    let textIncrement = ''
    
    const hasValidText = currentText && 
                        typeof currentText === 'string' &&
                        currentText !== '' && 
                        !(currentText.trim().startsWith('{') && currentText.trim().endsWith('}') && currentText.trim().length > 10)
    
    if (hasValidText) {
      if (this.lastReceivedText === '') {
        textIncrement = currentText
        this.lastReceivedText = currentText
      } else {
        if (currentText.length > this.lastReceivedText.length && 
            currentText.startsWith(this.lastReceivedText)) {
          textIncrement = currentText.substring(this.lastReceivedText.length)
          this.lastReceivedText = currentText
        }
        else if (currentText !== this.lastReceivedText) {
          textIncrement = currentText
          this.lastReceivedText += currentText
        }
        else {
          textIncrement = ''
        }
      }
    }
    
    const metadata: AIMessageMetadata = {}
    
    const toolCalls = (sseResponse as any).result?.output?.toolCalls || 
                     (sseResponse as any).results?.[0]?.output?.toolCalls ||
                     sseResponse.chatResponse?.result?.output?.toolCalls || 
                     sseResponse.chatResponse?.results?.[0]?.output?.toolCalls
    if (toolCalls && toolCalls.length > 0) {
      metadata.toolCalls = toolCalls.map((tc: any) => {
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
          status = (tc.arguments || tc.function?.arguments) ? 'calling' : 'pending'
        }
        
        const toolName = tc.name || tc.function?.name || tc.toolName || 'unknown'
        
        let toolArgs = ''
        if (tc.arguments) {
          toolArgs = typeof tc.arguments === 'string' ? tc.arguments : JSON.stringify(tc.arguments, null, 2)
        } else if (tc.function?.arguments) {
          toolArgs = typeof tc.function.arguments === 'string' ? tc.function.arguments : JSON.stringify(tc.function.arguments, null, 2)
        } else if (tc.input) {
          toolArgs = typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input, null, 2)
        }
        
        let toolResult: string | undefined = undefined
        if (tc.result !== undefined && tc.result !== null) {
          toolResult = typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result, null, 2)
        } else if (tc.output !== undefined && tc.output !== null) {
          toolResult = typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output, null, 2)
        }
        
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
    
    const retrievedDocs = sseResponse.context?.qa_retrieved_documents
    if (retrievedDocs && retrievedDocs.length > 0) {
      metadata.retrievedDocuments = retrievedDocs.map(doc => ({
        id: doc.id,
        content: doc.content || '',
        score: doc.score,
        source: doc.source
      }))
    }
    
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
    
    const hasMetadata = Object.keys(metadata).length > 0
    
    if (textIncrement !== undefined && textIncrement !== null && typeof textIncrement !== 'string') {
      if (typeof textIncrement === 'object') {
        textIncrement = ''
      } else {
        textIncrement = String(textIncrement)
      }
    }
    
    const textIncrementStr = typeof textIncrement === 'string' ? textIncrement : ''
    
    const hasTextIncrement = textIncrementStr !== undefined && 
                             textIncrementStr !== null && 
                             textIncrementStr !== '' && 
                             typeof textIncrementStr === 'string'
    
    let safeText = ''
    if (hasTextIncrement) {
      safeText = textIncrementStr
    }
    
    safeText = typeof safeText === 'string' ? safeText : ''
    
    let thinkingProcess = ''
    let displayText = safeText
    
    if (safeText) {
      const thinkRegex = /<think>([\s\S]*?)<\/think>/g
      const matches = [...this.lastReceivedText.matchAll(thinkRegex)]
      
      if (matches.length > 0) {
        thinkingProcess = matches.map(match => match[1]).join('\n\n')
        displayText = safeText.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      }
    }
    
    const hasValidDisplayText = displayText && displayText.length > 0
    
    if (hasValidDisplayText || hasMetadata || thinkingProcess) {
      options.onMessage?.({
        text: hasValidDisplayText ? String(displayText) : '',
        thinkingProcess: thinkingProcess || undefined,
        metadata: hasMetadata ? metadata : undefined
      })
    }
  }

  close() {
    if (this.reader) {
      this.reader.cancel()
      this.reader = null
    }
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }
    this.jsonBuffer = ''
    this.lastReceivedText = ''
  }
}

