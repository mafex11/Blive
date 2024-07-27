// app/api/streams/[id]/route.js
import connectToDatabase from '../../../../lib/db';
import User from '../../../../models/User';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const user = await User.findOne({ 'streams.playbackId': id }, { 'streams.$': 1 });

    if (!user || user.streams.length === 0) {
      return new Response(JSON.stringify({ error: 'Stream not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user.streams[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching stream:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
