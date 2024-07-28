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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Watch Streams</h1>
      {activeStreams.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {activeStreams.map((stream, index) => (
            <Link href={`/stream/${stream.playbackId}`} key={index} passHref>
              <div className="block p-4 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition transform hover:-translate-y-1 cursor-pointer">
                <h2 className="text-lg font-semibold">{stream.streamTitle}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No active streams available</p>
      )}
    </div>
  );
};

export default WatchStreamPage;
