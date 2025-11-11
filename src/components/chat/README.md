# Chat Components 组件结构

## 目录结构

```
chat/
├── ChatHeader.tsx           # 聊天页面头部
├── ChatInput.tsx            # 聊天输入区域（整合模型配置、图片上传、消息输入）
├── ChatSidebar.tsx          # 聊天侧边栏（聊天室列表）
├── MessageItem.tsx          # 单条消息项
├── MessageList.tsx          # 消息列表
├── StreamingText.tsx        # 流式文本显示组件
├── input/                   # 输入相关组件
│   ├── hooks/
│   │   ├── useModelConfig.ts    # 模型配置 Hook
│   │   └── useSendMessage.ts    # 发送消息 Hook
│   ├── ImageUploader.tsx        # 图片上传组件
│   ├── MessageTextArea.tsx      # 消息输入框
│   ├── ModelConfigPanel.tsx     # 模型配置面板
│   ├── ModelFeatures.tsx        # 模型功能选项
│   ├── ModelSelector.tsx        # 模型选择器
│   └── utils.ts                 # 工具函数
├── markdown/                # Markdown 渲染相关
│   ├── config.ts                # Markdown 配置
│   └── MarkdownRenderer.tsx     # Markdown 渲染器
├── message/                 # 消息相关组件
│   ├── AvatarBadge.tsx          # 头像徽章
│   ├── EmptyState.tsx           # 空状态
│   ├── MessageActions.tsx       # 消息操作栏
│   ├── MessageContent.tsx       # 消息内容
│   ├── RAGDocumentsPanel.tsx    # RAG 文档面板
│   ├── SampleQuestions.tsx      # 示例问题
│   ├── StreamingIndicator.tsx   # 流式传输指示器
│   ├── ThinkingProcessPanel.tsx # 思考过程面板
│   ├── ToolCallItem.tsx         # 工具调用项
│   ├── ToolCallsPanel.tsx       # 工具调用面板
│   ├── styles.ts                # 样式常量
│   └── index.ts                 # 组件导出
└── sidebar/                 # 侧边栏相关组件
    ├── ChatRoomList.tsx         # 聊天室列表
    ├── SidebarFooter.tsx        # 侧边栏底部
    └── SidebarHeader.tsx        # 侧边栏头部
```

## 组件设计原则

### 1. 高内聚低耦合
- 每个组件职责单一，功能明确
- 组件之间通过 Props 传递数据，减少依赖
- 使用 Hooks 提取业务逻辑，组件只负责 UI 渲染

### 2. 可复用性
- 提取公共样式到 `styles.ts`
- 提取业务逻辑到自定义 Hooks
- 将 Markdown 渲染逻辑独立为组件

### 3. 代码组织
- 按功能模块组织文件
- 相关组件放在同一目录
- 使用 `index.ts` 统一导出

## 主要组件说明

### MessageContent
消息内容组件，整合了：
- RAGDocumentsPanel: RAG 文档展示
- ToolCallsPanel: 工具调用展示
- ThinkingProcessPanel: 思考过程展示
- StreamingText: 流式文本渲染
- StreamingIndicator: 流式传输指示器

### ChatInput
聊天输入组件，整合了：
- ModelConfigPanel: 模型配置
- ImageUploader: 图片上传
- MessageTextArea: 消息输入框
- useModelConfig: 模型配置逻辑
- useSendMessage: 发送消息逻辑

### MessageList
消息列表组件，负责：
- 渲染消息列表
- 自动滚动到底部
- 空状态展示

## 样式管理

样式常量统一管理在 `message/styles.ts`，包括：
- 消息卡片样式
- 折叠面板样式
- 代码块样式
- 颜色常量

## Hooks

### useModelConfig
管理模型配置状态：
- selectedModel: 选中的模型
- useWebSearch: 是否启用联网搜索
- useRAG: 是否启用 RAG
- useToolCalling: 是否启用工具调用

### useSendMessage
处理消息发送逻辑：
- 清理输入值
- 处理图片上传
- 构建配置对象
- 调用发送回调


