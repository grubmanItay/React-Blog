import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma'
import { NextRequest } from "next/server";
const jwt = require('jsonwebtoken')

const getTokenFrom = (request: NextApiRequest) => {
    console.log
    const auth = request.headers["authorization"];
    const token = auth ? auth as string : null;
    if (token && token.startsWith('Bearer ')) {
        return token.replace('Bearer ', '');
    }
    return null;
}

// this is a workaround i made for Drafts page
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = getTokenFrom(req);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        // const user = JSON.parse(req.headers.get("user"))
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