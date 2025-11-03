# 水产品食品安全监测智能问答平台 - 使用指南

## 项目简介

这是一个基于 Next.js 15 的服务端渲染版本的 AI 智能问答平台，完全复刻了原 Vue 3 项目的功能，使用 Ant Design 5 组件库构建现代化的用户界面。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **UI 组件库**: Ant Design 5.28.0
- **状态管理**: Zustand 5.0.8
- **HTTP 客户端**: Axios 1.13.1
- **Markdown 渲染**: Marked 16.4.1
- **包管理器**: pnpm

## 项目结构

```
waterai-frontend-ssr/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页
│   │   ├── globals.css         # 全局样式
│   │   ├── 403/                # 无权限页面
│   │   ├── not-found.tsx       # 404 页面
│   │   ├── user/               # 用户相关页面
│   │   │   ├── login/          # 登录页
│   │   │   ├── register/       # 注册页
│   │   │   └── profile/        # 个人中心
│   │   ├── ai/                 # AI 功能页面
│   │   │   └── chat/           # 聊天页面（支持动态路由）
│   │   └── admin/              # 管理员页面
│   │       └── user/           # 用户管理
│   ├── components/             # 可复用组件
│   │   ├── GlobalHeader.tsx    # 全局头部
│   │   ├── GlobalFooter.tsx    # 全局底部
│   │   ├── GlobalLayout.tsx    # 全局布局
│   │   └── chat/               # 聊天相关组件
│   │       ├── ChatHeader.tsx
│   │       ├── ChatSidebar.tsx
│   │       ├── ChatInput.tsx
│   │       ├── MessageList.tsx
│   │       └── MessageItem.tsx
│   └── lib/                    # 工具库
│       ├── api/                # API 接口
│       │   ├── userController.ts
│       │   ├── aiController.ts
│       │   └── index.ts
│       ├── store/              # 状态管理
│       │   └── userStore.ts
│       ├── hooks/              # 自定义 Hooks
│       │   ├── useChatRoom.ts
│       │   └── useChatMessages.ts
│       ├── types/              # TypeScript 类型定义
│       │   ├── api.d.ts
│       │   └── chat.ts
│       ├── constants/          # 常量定义
│       │   ├── roleEnums.ts
│       │   └── chat.ts
│       └── utils/              # 工具函数
│           ├── request.ts
│           ├── checkAccess.ts
│           ├── sse.ts
│           └── messageParser.ts
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 功能特性

### ✅ 已实现的功能

1. **用户系统**

   - ✅ 用户登录/注册
   - ✅ 用户个人中心（修改资料、修改密码）
   - ✅ 用户状态管理（Zustand）
   - ✅ 登录状态持久化

2. **AI 智能问答**

   - ✅ 实时流式 AI 对话（SSE）
   - ✅ 多模型支持（GLM-Z1-Flash、GLM-4.5-Flash、GLM-4-Flash）
   - ✅ 高级功能配置（联网搜索、RAG 增强、工具调用）
   - ✅ 聊天室历史记录管理
   - ✅ 聊天室切换
   - ✅ 消息本地缓存
   - ✅ Markdown 渲染
   - ✅ 思考过程展示（<think>标签解析）
   - ✅ 示例问题快速开始

3. **管理员功能**

   - ✅ 用户列表查询
   - ✅ 用户信息管理（增删改查）
   - ✅ 用户角色管理
   - ✅ 分页和搜索功能

4. **权限控制**

   - ✅ 基于角色的访问控制（RBAC）
   - ✅ 路由权限保护
   - ✅ 未登录自动跳转

5. **UI/UX**
   - ✅ 响应式设计
   - ✅ 现代化界面
   - ✅ 流畅的动画效果
   - ✅ 友好的错误提示

## 安装和运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置后端 API

编辑 `next.config.js`，修改后端 API 地址：

```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*", // 修改为你的后端地址
      },
    ];
  },
};
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:8116

### 4. 构建生产版本

```bash
pnpm build
pnpm start
```

## 与原项目的差异

### 技术栈差异

| 特性     | 原项目          | SSR 版本           |
| -------- | --------------- | ------------------ |
| 框架     | Vue 3 + Vite    | Next.js 15         |
| UI 库    | Arco Design Vue | Ant Design         |
| 状态管理 | Pinia           | Zustand            |
| 路由     | Vue Router      | Next.js App Router |
| 渲染模式 | 客户端渲染      | 服务端渲染         |

### 功能保持一致

- ✅ API 接口完全一致
- ✅ 业务逻辑完全一致
- ✅ 用户体验完全一致
- ✅ 所有功能特性完全一致

### UI 差异

- UI 组件库不同（Arco Design → Ant Design）
- 视觉风格略有差异，但保持了相似的设计语言
- 交互逻辑和用户流程完全一致

## 核心功能使用说明

### AI 聊天功能

1. **创建新对话**: 点击侧边栏"新建对话"按钮
2. **选择模型**: 点击输入框旁的设置图标，选择 AI 模型
3. **启用功能**: 勾选"联网搜索"、"RAG 增强"、"工具调用"等选项
4. **发送消息**: 在输入框输入问题，按 Enter 发送
5. **查看历史**: 左侧边栏显示所有历史对话
6. **切换对话**: 点击历史记录项切换到对应的对话

### 用户管理（管理员）

1. **查看用户**: 进入"用户管理"页面查看所有用户
2. **搜索用户**: 使用搜索框按昵称搜索
3. **新增用户**: 点击"新增用户"按钮，填写表单
4. **编辑用户**: 点击表格中的"编辑"按钮
5. **删除用户**: 点击"删除"按钮，确认后删除

## 权限说明

### 角色类型

- **public**: 未登录用户（可访问首页、登录、注册页面）
- **user**: 普通用户（可使用 AI 问答功能）
- **admin**: 管理员（可访问用户管理页面）
- **ban**: 封禁用户（无法访问需要登录的功能）

### 页面权限

| 页面      | public | user | admin |
| --------- | ------ | ---- | ----- |
| 主页      | ✅     | ✅   | ✅    |
| 登录/注册 | ✅     | ✅   | ✅    |
| AI 问答   | ❌     | ✅   | ✅    |
| 个人中心  | ❌     | ✅   | ✅    |
| 用户管理  | ❌     | ❌   | ✅    |

## API 接口说明

### 用户相关

- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `POST /api/user/logout` - 用户登出
- `GET /api/user/get/login` - 获取当前登录用户
- `POST /api/user/update/profile` - 更新个人资料
- `POST /api/user/update/password` - 修改密码

### AI 相关

- `POST /api/ai/chat` - AI 文本对话（SSE 流式）
- `POST /api/ai/vision-chat` - AI 视觉对话（SSE 流式）
- `GET /api/ai/chatroom/list` - 获取聊天室列表
- `POST /api/ai/chatroom/create` - 创建聊天室
- `GET /api/ai/chatroom/{id}` - 获取聊天室详情
- `GET /api/ai/chatroom/{id}/messages` - 获取聊天室消息

### 管理员相关

- `POST /api/user/list/page` - 分页查询用户列表
- `POST /api/user/add` - 新增用户
- `POST /api/user/update` - 更新用户
- `POST /api/user/delete` - 删除用户

## 开发注意事项

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 开发建议

1. **使用 TypeScript**: 项目已配置完整的类型系统
2. **遵循代码规范**: 使用 ESLint 进行代码检查
3. **组件化开发**: 保持组件的单一职责
4. **类型安全**: 充分利用 TypeScript 的类型检查

### 调试技巧

1. **查看网络请求**: 浏览器开发工具 → Network 标签
2. **查看 SSE 连接**: Network 标签中筛选 EventStream
3. **查看状态管理**: 安装 Redux DevTools 查看 Zustand 状态
4. **查看本地存储**: Application → Local Storage

## 常见问题

### 1. 无法连接后端

**原因**: 后端服务未启动或 API 地址配置错误

**解决**:

- 确保后端服务正常运行
- 检查 `next.config.js` 中的 API 代理配置

### 2. SSE 连接失败

**原因**:

- 后端不支持 SSE
- 网络问题
- 浏览器兼容性

**解决**:

- 检查后端 SSE 实现
- 查看浏览器控制台错误信息
- 尝试使用现代浏览器

### 3. 登录后跳转到登录页

**原因**: Cookie 未正确设置

**解决**:

- 检查 `withCredentials: true` 配置
- 确保前后端域名配置正确
- 检查浏览器 Cookie 设置

## 部署说明

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（如需要）
4. 部署

### 自托管部署

1. 构建生产版本: `pnpm build`
2. 启动服务: `pnpm start`
3. 使用 PM2 或其他进程管理器保持运行

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

本项目与原项目保持一致的许可证。

## 联系方式

如有问题，请通过 Issue 反馈。
