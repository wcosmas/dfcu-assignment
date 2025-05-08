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
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}; 