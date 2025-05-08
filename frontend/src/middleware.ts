import { NextResponse, type NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isLoggedIn = request.cookies.has('accessToken');

    // If the user is trying to access the API routes, don't redirect
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // If the user is not logged in and trying to access a protected route,
    // redirect to the login page
    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If the user is logged in and trying to access the login page,
    // redirect to the dashboard
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - *.svg and other public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|logo.svg|globe.svg|next.svg|vercel.svg|window.svg|file.svg).*)',
    ],
}; 