import { NextResponse } from 'next/server'

export function middleware(req) {

  const isRevalidationRequest = !!req.headers.get("x-prerender-revalidate");

  if(process.env.NODE_ENV === 'development' || isRevalidationRequest) 
    return NextResponse.next()

  
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')

    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD)
      return NextResponse.next()
  }

  return new Response('Authorization required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"'},
  })
}