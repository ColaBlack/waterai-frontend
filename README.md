# WaterAI Frontend - 前端项目

## 项目简介

WaterAI前端基于Next.js 14构建，采用TypeScript开发，提供现代化的用户界面和流畅的交互体验。

## 技术栈

- **Next.js**: 14 (React框架)
- **TypeScript**: 5.0+ (类型安全)
- **Ant Design**: 5.0+ (UI组件库)
- **Zustand**: 4.0+ (状态管理)
- **Axios**: 1.6+ (HTTP客户端)
- **ECharts**: 5.0+ (图表库)
- **React Markdown**: 9.0+ (Markdown渲染)
- **Framer Motion**: 11.0+ (动画库)

## 项目结构

```
waterai-frontend/
├── src/
│   ├── app/                   # 页面路由（App Router）
│   │   ├── ai/               # AI对话相关页面
│   │   │   ├── chat/         # 文本对话页面
│   │   │   └── vision/       # 视觉对话页面
│   │   ├── data/             # 数据相关页面
│   │   │   ├── entity/       # 实体数据页面
│   │   │   ├── market/       # 市场数据页面
│   │   │   └── sampling/     # 抽样数据页面
│   │   ├── knowledge/        # 知识库页面
│   │   ├── statistics/       # 统计页面
│   │   ├── user/             # 用户相关页面
│   │   │   ├── login/        # 登录页面
│   │   │   └── register/     # 注册页面
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 首页
│   │
│   ├── components/            # 组件
│   │   ├── chat/             # 聊天组件
│   │   │   ├── message/      # 消息组件
│   │   │   ├── ChatInterface.tsx  # 聊天界面
│   │   │   ├── ChatSidebar.tsx    # 聊天侧边栏
│   │   │   ├── StreamingText.tsx  # 流式文本
│   │   │   └── CopyButton.tsx     # 复制按钮
│   │   ├── vision-chat/      # 视觉聊天组件
│   │   │   ├── vision-chat-interface.tsx  # 视觉聊天界面
│   │   │   ├── VisionChatSidebar.tsx      # 视觉聊天侧边栏
│   │   │   └── VisionChatHeader.tsx       # 视觉聊天头部
│   │   ├── ui/               # UI组件
│   │   │   ├── image-cropper.tsx  # 图片裁剪
│   │   │   └── loading.tsx        # 加载组件
│   │   ├── GlobalLayout.tsx  # 全局布局
│   │   └── Header.tsx        # 头部组件
│   │
│   ├── lib/                   # 工具库
│   │   ├── api/              # API接口
│   │   │   ├── chatService/  # 聊天服务API
│   │   │   ├── userService/  # 用户服务API
│   │   │   └── file.ts       # 文件上传API
│   │   ├── constants/        # 常量定义
│   │   │   └── models.ts     # AI模型常量
│   │   ├── hooks/            # 自定义Hooks
│   │   │   ├── useChatRoom.ts       # 聊天室Hook
│   │   │   └── useVisionChatRoom.ts # 视觉聊天室Hook
│   │   ├── store/            # 状态管理
│   │   │   └── userStore.ts  # 用户状态
│   │   ├── types/            # 类型定义
│   │   │   └── chat.ts       # 聊天类型
│   │   └── utils/            # 工具函数
│   │       ├── messageParser.ts    # 消息解析
│   │       └── imageCompress.ts    # 图片压缩
│   │
│   └── styles/                # 样式文件
│       └── globals.css        # 全局样式
│
├── public/                    # 静态资源
│   ├── images/               # 图片资源
│   └── favicon.ico           # 网站图标
│
├── next.config.js            # Next.js配置
├── tsconfig.json             # TypeScript配置
├── package.json              # 项目依赖
└── pnpm-lock.yaml           # 依赖锁定文件
```

## 主要功能模块

### 1. 文本对话 (/ai/chat)

**功能特性**：
- 支持4种AI文本模型选择
- 实时流式响应显示
- 多轮对话上下文记忆
- RAG知识检索
- MCP工具调用展示
- 对话历史管理
- 消息复制和导出

**核心组件**：
- `ChatInterface.tsx` - 主聊天界面
- `ChatSidebar.tsx` - 聊天室侧边栏
- `StreamingText.tsx` - 流式文本渲染
- `MessageItem.tsx` - 消息项组件

### 2. 视觉对话 (/ai/vision)

**功能特性**：
- 支持4种AI视觉模型选择
- 图片上传和裁剪
- 图片预览和管理
- OCR文字识别
- 图像理解和分析
- 视觉对话历史

**核心组件**：
- `vision-chat-interface.tsx` - 视觉聊天界面
- `VisionChatSidebar.tsx` - 视觉聊天侧边栏
- `ImageCropper.tsx` - 图片裁剪组件

### 3. 知识库管理 (/knowledge)

**功能特性**：
- 文档上传（PDF、Word、Markdown等）
- 文档列表展示
- 文档删除管理
- 向量化状态显示

### 4. 数据统计 (/statistics)

**功能特性**：
- 水产品检测数据可视化
- ECharts图表展示
- 数据筛选和导出
- 多维度统计分析

### 5. 用户系统 (/user)

**功能特性**：
- 用户注册
- 用户登录
- JWT令牌管理
- 用户信息展示

## 开发指南

### 安装依赖

```bash
# 使用pnpm（推荐）
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
```

### 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

### 启动生产服务器

```bash
pnpm start
# 或
npm start
```

### 代码检查

```bash
pnpm lint
# 或
npm run lint
```

## 配置说明

### 1. API代理配置

`next.config.js`:
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8888/:path*', // 后端网关地址
      },
    ]
  },
}
```

### 2. 环境变量

创建 `.env.local` 文件：
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8888
NEXT_PUBLIC_APP_NAME=WaterAI
```

### 3. TypeScript配置

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 核心功能实现

### 1. SSE流式响应处理

```typescript
// 处理SSE流式响应
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData),
});

const reader = response.body?.getReader();
let fullResponse = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = new TextDecoder().decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      fullResponse += data;
      setStreamingResponse(fullResponse);
    }
  }
}
```

### 2. 图片上传和压缩

```typescript
// 图片压缩
const compressImage = async (file: File, options: CompressOptions) => {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 加载图片
  await new Promise((resolve) => {
    img.onload = resolve;
    img.src = URL.createObjectURL(file);
  });
  
  // 计算压缩后的尺寸
  let { width, height } = img;
  if (width > options.maxWidth) {
    height = (height * options.maxWidth) / width;
    width = options.maxWidth;
  }
  
  // 绘制并压缩
  canvas.width = width;
  canvas.height = height;
  ctx?.drawImage(img, 0, 0, width, height);
  
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
    }, 'image/jpeg', options.quality);
  });
};
```

### 3. Markdown渲染

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkBreaks]}
  components={{
    code({ node, inline, className, children, ...props }) {
      // 代码高亮处理
    },
    a({ node, children, ...props }) {
      // 链接处理
    },
  }}
>
  {content}
</ReactMarkdown>
```

## 状态管理

使用Zustand进行状态管理：

```typescript
// userStore.ts
import { create } from 'zustand';

interface UserState {
  loginUser: User | null;
  setLoginUser: (user: User | null) => void;
  fetchLoginUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  loginUser: null,
  setLoginUser: (user) => set({ loginUser: user }),
  fetchLoginUser: async () => {
    const user = await getUserInfo();
    set({ loginUser: user });
  },
}));
```

## 样式规范

### 1. 使用Ant Design主题

```typescript
// 自定义主题
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};
```

### 2. Tailwind CSS工具类

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'flex items-center',
  isActive && 'bg-blue-500',
  'hover:bg-gray-100'
)} />
```

## 性能优化

### 1. 图片优化

```typescript
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

### 2. 代码分割

```typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <Loading />,
  ssr: false,
});
```

### 3. 缓存策略

```typescript
// API缓存
const fetcher = (url: string) => 
  fetch(url, { next: { revalidate: 3600 } }).then(r => r.json());
```

## 部署指南

### 1. Vercel部署（推荐）

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 2. Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Nginx部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 常见问题

### 1. API请求跨域问题
使用Next.js的rewrites功能进行代理，避免跨域问题。

### 2. SSE连接中断
检查网络连接，增加超时时间，添加重连机制。

### 3. 图片上传失败
检查文件大小限制，确保后端图床服务正常运行。

### 4. 样式不生效
检查Tailwind配置，确保CSS文件正确导入。

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

Apache License 2.0
