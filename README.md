# 水产品食品安全监测智能问答平台 - SSR 版

基于 Next.js 的服务端渲染版本，使用 Ant Design 组件库。

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Ant Design 5
- Zustand (状态管理)
- Axios (HTTP 客户端)
- Marked (Markdown 渲染)

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 功能特性

- ✅ 用户登录/注册
- ✅ AI 智能问答 (SSE 流式返回)
- ✅ 聊天室历史记录管理
- ✅ 管理员用户管理
- ✅ 个人中心设置
- ✅ 权限控制系统
- ✅ 响应式设计

## 目录结构

```
src/
├── app/              # Next.js App Router 页面
├── components/       # 可复用组件
├── lib/             # 工具库
│   ├── api/         # API 接口
│   ├── store/       # 状态管理
│   ├── types/       # TypeScript 类型定义
│   └── utils/       # 工具函数
└── styles/          # 全局样式
```

## API 配置

默认 API 基础路径为 `/api`，会通过 Next.js rewrites 代理到后端服务器 `http://localhost:8080/api`。

可在 `next.config.js` 中修改后端地址。
