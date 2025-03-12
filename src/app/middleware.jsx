import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("jwt")?.value; // Get token from cookies

    const protectedRoutes = ["/contact", "/about"]; // Routes to protect

    if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL("/user-login", req.url)); // Redirect to login
    }

    return NextResponse.next(); // Continue to the requested page
}

// Apply middleware only to protected routes
export const config = {
    matcher: ["/contact", "/about"], // Protect these pages
};
