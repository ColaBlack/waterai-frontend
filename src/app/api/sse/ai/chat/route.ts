import { NextRequest } from 'next/server'

const BACKEND_BASE_URL = process.env.AI_BACKEND_BASE_URL || 'http://localhost:8115/api'

function joinUrl(base: string, path: string) {
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const prefixedPath = path.startsWith('/') ? path : `/${path}`
  return `${trimmedBase}${prefixedPath}`
}

export async function POST(request: NextRequest) {
  const targetUrl = joinUrl(BACKEND_BASE_URL, '/ai/chat')

  let body: string
  try {
    body = await request.text()
  } catch (error) {
    return new Response('Failed to read request body', { status: 400 })
  }

  const upstreamHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  }

  const cookie = request.headers.get('cookie')
  if (cookie) {
    upstreamHeaders['Cookie'] = cookie
  }

  const authorization = request.headers.get('authorization')
  if (authorization) {
    upstreamHeaders['Authorization'] = authorization
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: upstreamHeaders,
      body,
      cache: 'no-store',
      redirect: 'manual',
      duplex: 'half',
    })
  } catch (error) {
    return new Response('Failed to connect upstream', { status: 502 })
  }

  if (!upstreamResponse.body) {
    return new Response('Upstream response has no body', { status: 502 })
  }

  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'text/event-stream; charset=utf-8')
  responseHeaders.set('Cache-Control', 'no-cache, no-transform')
  responseHeaders.set('Connection', 'keep-alive')
  responseHeaders.set('X-Accel-Buffering', 'no')

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  })
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

