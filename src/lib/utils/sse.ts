/**
 * SSE (Server-Sent Events) 工具类
 * 用于处理服务端推送的流式数据
 */

export interface SSEOptions {
  onMessage?: (data: string) => void
  onError?: (error: Error) => void
  onOpen?: () => void
  onClose?: () => void
}

export class SSEClient {
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  private controller: AbortController | null = null
  private buffer: string = '' // 用于缓存不完整的消息

  /**
   * 连接到SSE端点
   * @param url SSE端点URL
   * @param body 请求体
   * @param options 回调选项
   */
  async connect(url: string, body: any, options: SSEOptions = {}) {
    this.controller = new AbortController()
    this.buffer = '' // 重置缓冲区

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: this.controller.signal,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
        
        // 按 SSE 标准格式处理：消息以 \n\n 分隔
        const messages = this.buffer.split('\n\n')
        
        // 最后一个可能是不完整的消息，保留在缓冲区
        this.buffer = messages.pop() || ''
        
        // 处理完整的消息
        for (const message of messages) {
          if (!message.trim()) continue
          
          // 解析消息中的 data: 行
          const lines = message.split('\n')
          let dataContent = ''
          
          for (const line of lines) {
            if (line.startsWith('data:')) {
              // 提取 data: 后的内容（兼容有无空格）
              const content = line.slice(5).trimStart()
              dataContent += content
            }
          }
          
          if (dataContent) {
            if (dataContent === '[DONE]') {
              options.onClose?.()
              this.close()
              return
            } else {
              // 立即回调，不做任何延迟
              options.onMessage?.(dataContent)
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        options.onError?.(error)
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
  }
}

