"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

const WatchStreamPage = () => {
  const [activeStreams, setActiveStreams] = useState([]);

  useEffect(() => {
    const fetchActiveStreams = async () => {
      const response = await fetch('/api/streams/active');
      const data = await response.json();
      setActiveStreams(data.streams);
    };

    fetchActiveStreams();
  }, []);

  return (
    <div>
      <h1>Watch Streams</h1>
      {activeStreams.length > 0 ? (
        activeStreams.map((stream, index) => (
          <div key={index}>
            <Link href={`/stream/${stream.playbackId}`}>
              {stream.streamTitle}
            </Link>
          </div>
        ))
      ) : (
        <p>No active streams available</p>
      )}
    </div>
  );
};

export default WatchStreamPage;
