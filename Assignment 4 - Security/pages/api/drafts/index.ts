import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma'
import { NextRequest } from "next/server";
const jwt = require('jsonwebtoken')

export const getTokenFrom = (request: NextApiRequest) => {
    const auth = JSON.parse(request.cookies["BlogAppUserToken"] || "{}")
    return auth.token
}

// this is a workaround i made for Drafts page
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = getTokenFrom(req);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                error: 'bad token in drafts'
            })
        }

        const drafts = await prisma.post.findMany({
            where: {
                author: { email: decodedToken.email },
                published: false,
            },
            include: {
                author: {
                    select: { name: true },
                },
            },
        });
        return res.status(200).json({ props: drafts });
    } catch (err) {
        res.status(500).json({ error: err })
    }
}