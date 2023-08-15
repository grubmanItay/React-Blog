import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

interface VideoMetadata {
  user: string;
  dateUploaded: Date;
  postId: Number;
  videoLink: string;
}

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
}

async function disconnect() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error disconnecting from MongoDB Atlas:', error);
  }
}

async function createVideoMetadata(metadata: VideoMetadata) {
  const db = client.db();
  const videoMetadataCollection = db.collection('videoMetadata');
  const result = await videoMetadataCollection.insertOne(metadata);
  return result.insertedId;
}

async function getVideoMetadataById(id: number) {
  const db = client.db();
  const videoMetadataCollection = db.collection('videoMetadata');
  const result = await videoMetadataCollection.findOne({ postId: id });
  return result;
}

async function deleteVideoMetadataById(id: number) {
  const db = client.db();
  const videoMetadataCollection = db.collection('videoMetadata');
  const result = await videoMetadataCollection.deleteOne({ postId: id });
  return result;
}

export { connect, disconnect, createVideoMetadata, getVideoMetadataById, deleteVideoMetadataById };
