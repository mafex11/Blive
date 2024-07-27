// app/api/stream-status/route.js
import { Livepeer } from 'livepeer';
import mongoose from 'mongoose';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/db';

const apiKey = process.env.LIVEPEER_API_KEY;
const livepeer = new Livepeer({ apiKey });

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const streamId = searchParams.get('streamId');

  if (!streamId) {
    return new Response(JSON.stringify({ error: 'Stream ID is required' }), { status: 400 });
  }

  try {
    const response = await livepeer.stream.get(streamId);
    console.log('Stream status fetched:', response);

    const {
      isActive,
      playbackId,
      status
    } = response.stream;

    // Connect to MongoDB
    await connectToDatabase();

    // Update the status in MongoDB
    await User.updateOne(
      { 'streams.streamId': streamId },
      { $set: { 'streams.$.status': isActive ? 'active' : 'inactive' } }
    );

    return new Response(JSON.stringify({
      playbackUrl: `https://livepeercdn.com/hls/${playbackId}/index.m3u8`,
      status: isActive ? 'active' : 'inactive'
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching stream status:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
