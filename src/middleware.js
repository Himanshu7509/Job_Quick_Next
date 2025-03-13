import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server';
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // console.log('middleware')
    // const authToken = request.cookies.get("jwt").value; 
    // console.log(authToken)
//   return NextResponse.redirect(new URL('/user-login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  // matcher: '/about',
}