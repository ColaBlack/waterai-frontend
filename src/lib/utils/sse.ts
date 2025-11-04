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
          'Accept': 'text/event-stream',
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
              dataParts.push(value)
            } else if (line.startsWith(':')) {
              // Comment line per SSE spec, ignore
              continue
            } else if (line.length > 0) {
              // 只添加非空行（避免额外的空行干扰）
              dataParts.push(line)
            }
          }

          // 保留原始内容，不进行额外的trim或过滤
          const combinedData = dataParts.join('\n')

          if (combinedData.length === 0) {
            continue
          }

          // 检查是否为控制消息（如 [DONE]），但不影响空白字符的传递
          const trimmedForControl = combinedData.trim()
          
          if (trimmedForControl === '[DONE]') {
            options.onClose?.()
            this.close()
            return
          }

          // 即使是纯空白字符（如换行符），也要传递给 onMessage
          // 不再跳过空白内容，因为换行符对格式很重要
          options.onMessage?.(combinedData)
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

