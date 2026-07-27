import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth/session';

const PROTECTED_PATHS = ['/admin'];
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname.startsWith(path) && !PUBLIC_ADMIN_PATHS.includes(pathname)
  );

  if (!isProtected) return NextResponse.next();

  const sessionToken = request.cookies.get('admin_session')?.value;
  const session = await decrypt(sessionToken);

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
