// app/api/update-stream-status/route.js
import mongoose from 'mongoose';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/db';

export async function POST(req, res) {
  const { streamId, status } = await req.json();

  if (!streamId || !status) {
    return new Response(JSON.stringify({ error: 'Stream ID and status are required' }), { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Find the user and update the stream status
    await User.updateOne(
      { 'streams.streamId': streamId },
      { $set: { 'streams.$.status': status } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error updating stream status:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
