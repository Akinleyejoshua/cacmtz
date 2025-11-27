// types/jwt.ts (or similar)
export interface JwtPayload {
  userId: number;
  username: string;
  iat: number; // Issued at (automatically added by jsonwebtoken)
  exp: number; // Expiration time (automatically added by jsonwebtoken)
}

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '1234567890';
const API_PREFIX = '/api/';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Use the advanced matcher config to exclude login/logout
  if (pathname.startsWith(API_PREFIX)) {
    const token = request.cookies.get('jwt-session')?.value;

    if (!token) {
      // If a protected route is requested without a token
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Cast the secret to a string and the return type of verify
      const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

      // Optional: You could now use Next.js response headers to pass the
      // decoded user ID to the API route itself for use.

      console.log(`User ${decoded.userId} authenticated for ${pathname}`);
      return NextResponse.next();
    } catch (error) {
      console.error('JWT Verification Failed:', (error as Error).message);

      const response = NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
      // Clear the invalid cookie
      response.cookies.set('jwt-session', '', { maxAge: 0 });
      return response;
    }
  }

  // Allow all non-API requests
  return NextResponse.next();
}

// 📌 Select Optional Paths
// This matcher runs the middleware on ALL /api/ paths *except* /api/login and /api/logout.
export default {
  matcher: '/api/:path*((?!login|logout|add-event).*)',
};