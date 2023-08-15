import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '../lib/prisma';
import Cookies from 'js-cookie';
const jwt = require('jsonwebtoken')

const getTokenFrom = (request: NextRequest) => {
    const auth = JSON.parse(Cookies.get("BlogAppUserToken") || "{}")
    return auth.token
}

export async function middleware(request: NextRequest) {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.userName) {
        return NextResponse.redirect('/login')
    }
    const user = await prisma.user.findUnique({
        where: {
            userName: decodedToken.userName,
        },
    });

    if (!user) {
        return NextResponse.redirect('/login')
    }
    else {
        const newHeaders = new Headers(request.headers)
        newHeaders.set('user', JSON.stringify(user))
        return NextResponse.next({
            request: {
                headers: newHeaders,
            },
        })
    }
}

export const config = {
    matcher: ['/api/post/:path*', '/api/drafts/:path*'],
}