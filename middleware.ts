import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const MAIN_SITE = 'https://fun-life-2026.vercel.app'
const COOKIE_NAME = 'fun_session'

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: Request) {
  const url = new URL(request.url)

  // 1. 检查 handoff token
  const handoffToken = url.searchParams.get('_t')
  if (handoffToken) {
    try {
      await jwtVerify(handoffToken, getSecret())
      url.searchParams.delete('_t')
      const response = NextResponse.redirect(url)
      response.cookies.set(COOKIE_NAME, handoffToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return response
    } catch {}
  }

  // 2. 检查 Cookie
  const session = (request as any).cookies.get(COOKIE_NAME)
  if (session?.value) {
    try {
      await jwtVerify(session.value, getSecret())
      return NextResponse.next()
    } catch {}
  }

  // 3. 重定向主站
  const loginUrl = new URL(MAIN_SITE)
  loginUrl.searchParams.set('redirect', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/).*)'],
}
