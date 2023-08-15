import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'
import { connect, deleteVideoMetadataById, disconnect } from '../../../lib/mongo'

// DELETE /api/post/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id;

  // const session = await getSession({ req })

  if (req.method === "DELETE") {


    // Delete from Prisma
    const post = await prisma.post.delete({
      where: { id: Number(postId) },
    });

    if (post.hasVideo) {
      // Delete from MongoDB
      try {
        await connect();
        await deleteVideoMetadataById(Number(postId));
        await disconnect();

        console.log(`post (${postId}) deleted successfully from MongoDB`);
      } catch (error) {
        console.error(`Error deleting post (${postId}) from MongoDB: `, error);
      }

      // Delete from Cloudinary
      const cloudinary = require('cloudinary').v2;

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      })

      try {
        await cloudinary.uploader.destroy(postId, {
          resource_type: 'video',
        });
        console.log(`post (${postId}) deleted successfully from Cloudinary`);
      } catch (error) {
        console.error(`Error deleting post (${postId}) from Cloudinary: `, error);
      }
    }

    res.json(post);


  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
