"use client";
import { useState, useEffect } from 'react';

const WatchStream = () => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('/api/get-streams');
        const data = await response.json();
        if (response.ok) {
          setStreams(data.streams);
        } else {
          console.error('Error fetching streams:', data.error);
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      }
    };

    fetchStreams();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Watch Stream</h1>
      {streams.length > 0 ? (
        streams.map((stream) => (
          <div key={stream.id} className="mb-4">
            <h2 className="text-lg font-semibold">{stream.name}</h2>
            <div className="mt-2">
              <Player src={stream.playbackUrl} />
            </div>
          </div>
        ))
      ) : (
        <p>No streams available</p>
      )}
    </div>
  );
};

// Assuming you have a Player component or use a library like @livepeer/react
import { Player } from "@livepeer/react";

export default WatchStream;
