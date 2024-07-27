// app/api/create-stream/route.js
import { Livepeer } from 'livepeer';
import mongoose from 'mongoose';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/db';

const apiKey = process.env.LIVEPEER_API_KEY;
const livepeer = new Livepeer({ apiKey });

export async function POST(req, res) {
  const { streamTitle, address } = await req.json();

  console.log('Received streamTitle:', streamTitle);  // Debug log
  console.log('Received address:', address);  // Debug log

  if (!streamTitle || !address) {
    return new Response(JSON.stringify({ error: 'Stream title and address are required' }), { status: 400 });
  }

  try {
    const response = await livepeer.stream.create({ name: streamTitle });
    console.log('Stream created:', response);

    const {
      id: streamId,
      streamKey,
      playbackId,
      createdAt,
      isActive
    } = response.stream;

    // Connect to MongoDB
    await connectToDatabase();

    // Log the data to be pushed to MongoDB
    console.log('Data to be stored in MongoDB:', {
      streamTitle,
      streamId,
      streamKey,
      playbackUrl: `https://livepeercdn.com/hls/${playbackId}/index.m3u8`,
      playbackId,
      createdAt,
      status: isActive ? 'active' : 'inactive'
    });

    // Find the user and update their document with the new stream details
    await User.updateOne(
      { address },
      { $push: { streams: { streamTitle, streamId, streamKey, playbackUrl: `https://livepeercdn.com/hls/${playbackId}/index.m3u8`, playbackId, createdAt, status: isActive ? 'active' : 'inactive' } } }
    );

    return new Response(JSON.stringify({
      rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
      streamId,
      streamKey,
      playbackUrl: `https://livepeercdn.com/hls/${playbackId}/index.m3u8`,
      createdAt,
      status: isActive ? 'active' : 'inactive',
      playbackId
    }), { status: 200 });
  } catch (error) {
    console.error('Error creating stream:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
