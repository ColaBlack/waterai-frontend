import { useState, useCallback, useEffect } from 'react'
import { isTextModel, DEFAULT_MODEL, isMiniMaxM21 } from '@/lib/constants/models'

export function useModelConfig() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const [enableThinking, setEnableThinking] = useState<boolean>(false)

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel)
    // 如果切换到 MiniMax-M2.1，自动启用思考模式
    if (isMiniMaxM21(newModel)) {
      setEnableThinking(true)
    }
  }, [])

  const handleThinkingChange = useCallback((enabled: boolean) => {
    // MiniMax-M2.1 不允许关闭思考模式
    if (isMiniMaxM21(selectedModel) && !enabled) {
      return
    }
    setEnableThinking(enabled)
  }, [selectedModel])

  // 当模型是 MiniMax-M2.1 时，确保思考模式始终开启
  useEffect(() => {
    if (isMiniMaxM21(selectedModel)) {
      setEnableThinking(true)
    }
  }, [selectedModel])

  const isText = isTextModel(selectedModel)

  return {
    selectedModel,
    isText,
    enableThinking,
    setSelectedModel: handleModelChange,
    setEnableThinking: handleThinkingChange,
  }
}


