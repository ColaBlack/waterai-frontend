import { useState, useCallback } from 'react'
import { isTextModel, DEFAULT_MODEL } from '@/lib/constants/models'

export function useModelConfig() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [useRAG, setUseRAG] = useState(false)
  const [useToolCalling, setUseToolCalling] = useState(false)

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel)
    if (!isTextModel(newModel)) {
      setUseWebSearch(false)
      setUseRAG(false)
      setUseToolCalling(false)
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


