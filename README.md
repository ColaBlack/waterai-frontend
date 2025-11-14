# WaterAI Frontend

水产品安全监测平台前端应用，基于 Next.js 14 构建的现代化 Web 应用。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI库**: Ant Design 5
- **状态管理**: Zustand
- **样式**: CSS-in-JS
- **HTTP客户端**: Axios
- **实时通信**: Server-Sent Events (SSE)

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── ai/chat/           # AI对话页面
│   ├── admin/             # 管理员页面
│   └── user/              # 用户相关页面
├── components/            # 可复用组件
│   ├── chat/              # 聊天相关组件
│   ├── ui/                # 基础UI组件
│   └── GlobalHeader.tsx   # 全局导航栏
├── lib/                   # 工具库和配置
│   ├── api/               # API接口定义
│   ├── hooks/             # 自定义Hooks
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   └── constants/         # 常量定义
└── styles/                # 全局样式
```

## 核心功能

### 1. AI对话系统
- **多模型支持**: GLM-Z1-Flash、GLM-4.5-Flash、GLM-4-Flash
- **视觉模型**: GLM-4V-Flash、GLM-4.1V-Thinking-Flash
- **实时流式响应**: 基于SSE的流式数据传输
- **多轮对话**: 支持上下文记忆的连续对话

### 2. 智能增强功能
- **RAG检索**: 自动从向量数据库检索相关文档
- **工具调用**: MongoDB数据库查询能力
- **联网搜索**: DuckDuckGo实时搜索
- **思考过程**: 显示AI的推理过程

### 3. 用户体验
- **响应式设计**: 适配各种屏幕尺寸
- **暗色主题**: 护眼的深色界面
- **快捷操作**: 键盘快捷键支持
- **历史记录**: 本地和云端同步

## 开发环境

### 环境要求
- Node.js 18+
- npm/yarn/pnpm

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:8116](http://localhost:8116)

### 构建生产版本
```bash
npm run build
npm start
```

## 配置说明

### 环境变量
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8117
NEXT_PUBLIC_APP_NAME=WaterAI
```

### API配置
后端API地址配置在 `src/lib/api/config.ts`

## 核心组件

### 1. 聊天组件 (`src/components/chat/`)
- `ChatInput.tsx`: 消息输入组件
- `MessageList.tsx`: 消息列表组件
- `StreamingText.tsx`: 流式文本显示
- `ToolCallsPanel.tsx`: 工具调用结果展示

### 2. Hooks (`src/lib/hooks/`)
- `useChatMessages.ts`: 聊天消息管理
- `useUserStore.ts`: 用户状态管理
- `useModelConfig.ts`: 模型配置管理

### 3. 工具库 (`src/lib/utils/`)
- `sse.ts`: SSE客户端实现
- `auth.ts`: 认证工具
- `api.ts`: API请求封装

## 认证系统

- **JWT认证**: 基于Token的无状态认证
- **自动刷新**: Token自动续期机制
- **权限控制**: 基于角色的访问控制

## 响应式设计

- **移动端优化**: 触摸友好的交互设计
- **平板适配**: 中等屏幕的布局优化
- **桌面端**: 大屏幕的多列布局

## 部署

### Vercel部署
```bash
npm run build
vercel --prod
```

### Docker部署
```bash
docker build -t waterai-frontend .
docker run -p 8116:3000 waterai-frontend
```

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件采用函数式编程
- 使用自定义Hooks抽取逻辑

### 文件命名
- 组件: PascalCase (如 `ChatInput.tsx`)
- Hooks: camelCase with use前缀 (如 `useChatMessages.ts`)
- 工具函数: camelCase (如 `formatDate.ts`)
- 类型定义: PascalCase (如 `ChatMessage.ts`)

### Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 许可证

MIT License