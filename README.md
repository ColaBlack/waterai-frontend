# WaterAI Frontend - 水产品安全AI助手前端

## 项目简介

WaterAI前端是一个基于Next.js 15和React 19的现代化Web应用，提供AI对话、知识库管理、系统统计等功能。

## 技术栈

- **框架**: Next.js 15.1.4, React 19.2.0
- **UI库**: Ant Design 5.22.5
- **HTTP客户端**: Axios 1.7.7
- **Markdown**: React Markdown 10.1.0
- **语言**: TypeScript

## 项目结构

```
waterai-frontend/
├── src/
│   ├── app/
│   │   ├── admin/              # 管理员页面
│   │   │   ├── chat/           # 聊天管理
│   │   │   ├── user/           # 用户管理
│   │   │   ├── knowledge/      # 知识库管理
│   │   │   └── statistics/     # 系统统计
│   │   ├── ai/                 # AI对话页面
│   │   ├── user/               # 用户页面
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # 公共组件
│   └── lib/                    # 工具函数
├── public/                     # 静态资源
└── package.json                # 项目配置
```

## 核心功能

### 1. AI对话

- **文本对话**: 支持多种GLM模型选择
- **视觉对话**: 支持图像上传和分析
- **流式响应**: 实时显示AI回复
- **对话历史**: 保存和管理对话记录

### 2. 知识库管理（管理员）

- 文档上传（支持md, pdf, txt, doc, docx）
- 文档列表查看
- 文档删除
- 处理状态显示

### 3. 系统统计（管理员）

- 用户统计
- 对话统计
- 知识库统计
- 实时数据刷新

### 4. 用户管理

- 用户注册/登录
- 个人信息管理
- 对话历史查看

## 快速开始

### 1. 环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:8116

### 5. 构建生产版本

```bash
pnpm build
pnpm start
# 或
npm run build
npm start
```

## 页面路由

### 公共页面
- `/` - 首页
- `/ai/chat` - AI文本对话
- `/ai/vision` - AI视觉对话
- `/user/login` - 用户登录
- `/user/register` - 用户注册

### 管理员页面
- `/admin/statistics` - 系统统计
- `/admin/knowledge` - 知识库管理
- `/admin/user` - 用户管理
- `/admin/chat` - 聊天管理

## API集成

### 配置

所有API请求通过axios发送，基础URL配置在环境变量中：

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### 请求头

```typescript
headers: {
  "X-User-Id": localStorage.getItem("userId"),
  "X-User-Role": localStorage.getItem("userRole")
}
```

### 主要API端点

- `POST /api/ai/chat` - 文本对话
- `POST /api/ai/chat/vision` - 视觉对话
- `GET /api/knowledge/list` - 获取知识库列表
- `POST /api/knowledge/upload` - 上传文档
- `GET /api/statistics` - 获取系统统计

## 组件说明

### AI对话组件

```typescript
// 文本对话
<ChatInterface 
  modelName="glm-4.5-flash"
  enableRAG={true}
  enableMCP={true}
/>

// 视觉对话
<VisionChatInterface
  modelName="glm-4v-flash"
  maxImages={10}
/>
```

### 知识库管理

```typescript
<KnowledgeManagement
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

### 系统统计

```typescript
<StatisticsDashboard
  refreshInterval={60000}
/>
```

## 样式规范

### 使用Ant Design主题

```typescript
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
    },
  }}
>
  <App />
</ConfigProvider>
```

### 响应式设计

使用Ant Design的Grid系统：

```typescript
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>
    <Card>...</Card>
  </Col>
</Row>
```

## 状态管理

使用React Hooks进行状态管理：

```typescript
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchData();
}, []);
```

## 错误处理

统一的错误处理：

```typescript
try {
  const response = await axios.get(url);
  if (response.data.code === 200) {
    // 成功处理
  } else {
    message.error(response.data.message);
  }
} catch (error) {
  console.error(error);
  message.error("操作失败");
}
```

## 性能优化

### 1. 代码分割

Next.js自动进行代码分割，按需加载页面。

### 2. 图片优化

使用Next.js的Image组件：

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
/>
```

### 3. 懒加载

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spin />,
});
```

## 开发规范

### 文件命名

- 组件文件：PascalCase (e.g., `ChatInterface.tsx`)
- 工具文件：camelCase (e.g., `formatDate.ts`)
- 页面文件：kebab-case (e.g., `user-profile.tsx`)

### 代码风格

- 使用TypeScript严格模式
- 使用函数组件和Hooks
- 遵循ESLint规则

### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具变动
```

## 常见问题

### 1. API请求失败

检查环境变量配置和后端服务状态。

### 2. 样式不生效

确保正确导入了Ant Design的CSS。

### 3. 路由跳转问题

使用Next.js的Link组件或useRouter hook。

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 部署

### Vercel部署

```bash
pnpm build
vercel --prod
```

### Docker部署

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

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/your-repo/waterai
- 问题反馈: https://github.com/your-repo/waterai/issues
