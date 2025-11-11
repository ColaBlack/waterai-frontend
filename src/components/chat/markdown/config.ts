/**
 * Markdown 渲染配置
 */
import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
})

export { marked }


