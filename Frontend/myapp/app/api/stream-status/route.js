import { Livepeer } from 'livepeer';

const apiKey = process.env.LIVEPEER_API_KEY; // Ensure this is set correctly
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

    return new Response(JSON.stringify({
      playbackUrl: `https://livepeercdn.com/hls/${playbackId}/index.m3u8`,
      status: isActive ? 'active' : 'inactive'
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching stream status:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
