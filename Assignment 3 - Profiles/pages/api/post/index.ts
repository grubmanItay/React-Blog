import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { IncomingForm } from "formidable";
import { connect, createVideoMetadata, disconnect } from '../../../lib/mongo'
import { getSession } from 'next-auth/react';

const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const config = {
  api: {
    bodyParser: false
  }
};


// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  const form = new IncomingForm();
  let postId = null
  let videoUrl: string = ''

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      res.status(400).send({ message: "bad form" })
      return;
    }


    const result = await prisma.post.create({
      data: {
        title: fields.title,
        content: fields.content,
        hasVideo: files.video ? true : false,
        author: { connect: { email: fields.email } },
      },
    });
    postId = result.id
    if (!files.video)
      res.json(result);


    if (files.video) {
      try {
        console.log(files.video)
        const response = await cloudinary.uploader.upload(files.video.filepath, {
          resource_type: 'video',
          public_id: postId,
        });
        videoUrl = response.secure_url
        console.log(`url for video:\n${videoUrl}`)


        const data = {
          user: fields.email || "undefined",
          dateUploaded: new Date,
          postId: Number(postId),
          videoLink: videoUrl || ""
        }

        await connect().then(() => createVideoMetadata(data)).finally(() => disconnect());
        res.json(videoUrl);
      }
      catch (error) {
        console.log(error)
        res.status(401).send({ message: 'cloudinary error' })
        return;
      }
    }
  });

}
