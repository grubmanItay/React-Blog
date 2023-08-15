import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// POST /api/auth/login
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body

    if (username === "" || password === ""){
        return res.status(400).json({
            error: 'All field are required'
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            userName: username as string,
        },
    });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    const userForToken = {
        username: user.userName,
        id: user.id,
        email: user.email
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1w',});

    res.status(200).send({ token: token, username: user.userName, name: user.name, email: user.email })
}