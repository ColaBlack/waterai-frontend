import { useState, useCallback } from 'react'
import { isTextModel, DEFAULT_MODEL } from '@/lib/constants/models'

export function useModelConfig() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const [useWebSearch, setUseWebSearch] = useState(true)
  const [useRAG, setUseRAG] = useState(true)
  const [useToolCalling, setUseToolCalling] = useState(true)

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel)
    if (!isTextModel(newModel)) {
      // 视觉模型不支持这些功能，自动禁用
      setUseWebSearch(false)
      setUseRAG(false)
      setUseToolCalling(false)
    } else {
      // 文本模型默认启用所有功能
      setUseWebSearch(true)
      setUseRAG(true)
      setUseToolCalling(true)
    }
  }, [])

  const isText = isTextModel(selectedModel)

  return {
    selectedModel,
    useWebSearch,
    useRAG,
    useToolCalling,
    isText,
    setSelectedModel: handleModelChange,
    setUseWebSearch,
    setUseRAG,
    setUseToolCalling,
  }
}


