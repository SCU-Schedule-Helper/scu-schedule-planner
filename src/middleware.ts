import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                set(name: string, value: string, options: { expires?: Date }) {
                    // This is used for setting cookies during auth flow, but we don't need it here
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                remove(name: string, options: { expires?: Date }) {
                    // This is used for removing cookies during auth flow, but we don't need it here
                },
            },
        }
    );

    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    // Allow requests to login page and API routes
    if (
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/api/') ||
        request.nextUrl.pathname.startsWith('/auth/')
    ) {
        return NextResponse.next();
    }

    // Check for mock user in development
    const hasMockUser = request.cookies.has('mock-user');

    // If user is not authenticated and there's no mock user, redirect to login
    if (!session && !hasMockUser) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 