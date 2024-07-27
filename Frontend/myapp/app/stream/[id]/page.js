"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const StreamPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = pathname.split('/').pop();
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchStream = async () => {
        const response = await fetch(`/api/streams/${id}`);
        const data = await response.json();
        setStream(data);
      };

      fetchStream();
    }
  }, [id]);

  if (!stream) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{stream.streamName}</h1>
      <iframe
        // src={`https://livepeercdn.com/hls/${stream.playbackId}/index.m3u8`}
        src={`https://lvpr.tv?v=${stream.playbackId}`} 
        width="640"
        height="360"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
};

export default StreamPage;
