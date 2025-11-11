/**
 * 消息组件样式常量
 */

export const messageStyles = {
  card: {
    user: {
      backgroundColor: '#f0f2f5',
      border: 'none',
    },
    ai: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e6eb',
    },
  },
  collapse: {
    rag: {
      backgroundColor: '#f0f9ff',
      borderRadius: '6px',
      padding: '4px',
    },
    tools: {
      backgroundColor: '#fff7e6',
      borderRadius: '6px',
      padding: '4px',
    },
    thinking: {
      backgroundColor: '#f5f7fa',
      borderRadius: '6px',
      padding: '4px',
    },
  },
  content: {
    maxHeight: '400px',
    scrollable: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
    },
  },
  indicator: {
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    border: '1px solid #bae7ff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  codeBlock: {
    fontSize: '12px',
    color: '#262626',
    backgroundColor: '#fafafa',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
    border: '1px solid #f0f0f0',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace',
  },
  resultBlock: {
    fontSize: '12px',
    color: '#262626',
    backgroundColor: '#f6ffed',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap' as const,
    border: '1px solid #b7eb8f',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, "source-code-pro", monospace',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  toolCard: {
    borderLeft: {
      completed: '#52c41a',
      failed: '#ff4d4f',
      calling: '#1890ff',
      default: '#d9d9d9',
    },
  },
} as const

export const colors = {
  primary: '#1890ff',
  success: '#52c41a',
  error: '#ff4d4f',
  warning: '#fa8c16',
  processing: '#1890ff',
  text: {
    primary: '#262626',
    secondary: '#595959',
    tertiary: '#8c8c8c',
    disabled: '#999',
  },
} as const


