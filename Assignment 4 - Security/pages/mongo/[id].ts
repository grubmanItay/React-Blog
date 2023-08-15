import type { NextApiRequest, NextApiResponse } from 'next';
import { connect, disconnect, createVideoMetadata, getVideoMetadataById } from '../../lib/mongo';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();

    if (req.method === 'POST') {
      const { user, postId, videoLink } = req.body;
      const dateUploaded = new Date();

      const metadata = {
        user,
        dateUploaded,
        postId,
        videoLink,
      };

      const insertedId = await createVideoMetadata(metadata);

      res.status(201).json({ insertedId });
    } else if (req.method === 'GET') {
      const { id } = req.query;
      const metadata = await getVideoMetadataById(parseInt(id as string, 10));

      if (metadata) {
        res.json(metadata);
      } else {
        res.status(404).json({ message: 'Video metadata not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await disconnect();
  }
}
