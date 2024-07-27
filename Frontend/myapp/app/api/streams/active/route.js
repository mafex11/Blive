// app/api/streams/active/route.js
import connectToDatabase from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req) {
  try {
    await connectToDatabase();
    const users = await User.find(
      { 'streams.status': 'active' },
      { 'streams.streamTitle': 1, 'streams.playbackId': 1, 'streams.status': 1 }
    );

    // Flatten the streams array and filter out inactive streams
    const streams = users.flatMap(user => user.streams.filter(stream => stream.status === 'active'));

    return new Response(JSON.stringify({ streams }), { status: 200 });
  } catch (error) {
    console.error('Error fetching active streams:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
