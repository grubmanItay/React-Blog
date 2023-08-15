import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '../../../lib/prisma'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// POST /api/auth/signup
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { fullName, username, email, password } = req.body

    if (fullName === "" || username === "" || email === "" || password === ""){
        return res.status(400).json({
            error: 'All field are required'
        })
    }

    const isUsernameOK:boolean = await prisma.user.count({
        where: {
                userName: username,
        },
    }) === 0 ? true : false;

    const isEmailOK:boolean = await prisma.user.count({
        where: {
                email: email,
        },
    }) === 0 ? true : false;

    if (!isUsernameOK) {
        return res.status(409).json({                   //HTTP status code 409 - Conflict
            error: 'Username already exists'
        })
    }

    if (!isEmailOK) {
        return res.status(409).json({                   //HTTP status code 409 - Conflict
            error: 'Email already exists'
        })
    }

    const salted = await bcrypt.hash(password,10);
    const userData: Prisma.UserCreateInput =
        {
          name: fullName,
          userName: username,
          passwordHash: salted,
          email: email,
        }
    
    try {
        const user = await prisma.user.create({
            data: userData
        })

        const userForToken = {
            username: user.userName,
            id: user.id,
        }

        const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1w',});
        
        res.status(201).send({ token, username: user.userName, name: user.name })   //HTTP status code 201 - Created
    } catch (error) {
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Internal Server Error' });                   //HTTP status code 500 - Internal Server Error
    }

}