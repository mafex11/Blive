// app/api/get-streams/route.js
import { Livepeer } from 'livepeer';

const apiKey = process.env.LIVEPEER_API_KEY;
const livepeer = new Livepeer({ apiKey });

export async function GET(req) {
  try {
    const response = await livepeer.stream.list(); // List all streams
    const streams = response.streams.map(stream => ({
      id: stream.id,
      name: stream.name,
      playbackUrl: `https://livepeer.com/playback/${stream.playbackId}` // Adjust as needed
    }));

    return new Response(JSON.stringify({ streams }), { status: 200 });
  } catch (error) {
    console.error('Error fetching streams:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
