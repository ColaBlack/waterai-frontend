import { useState, useCallback } from 'react'
import { isTextModel, DEFAULT_MODEL } from '@/lib/constants/models'

export function useModelConfig() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL)

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel)
  }, [])

  const isText = isTextModel(selectedModel)

  return {
    selectedModel,
    isText,
    setSelectedModel: handleModelChange,
  }
}


