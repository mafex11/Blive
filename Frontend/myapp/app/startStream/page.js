"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import detectEthereumProvider from '@metamask/detect-provider';

const StartStream = () => {
  const [streamTitle, setStreamTitle] = useState('');
  const [message, setMessage] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();
  const [intervalId, setIntervalId] = useState(null);

  // Fetch MetaMask address
  useEffect(() => {
    const fetchAddress = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } else {
        console.error('MetaMask not detected');
      }
    };
    fetchAddress();
  }, []);

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      setMessage('Stream title is required');
      return;
    }

    if (!address) {
      setMessage('User address is required');
      return;
    }

    setMessage('Creating stream...');

    try {
      const response = await fetch('/api/create-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamTitle, address }),
      });
      const data = await response.json();
      if (response.ok) {
        setStreamInfo(data);
        setStatus(data.status);
        setMessage('Stream created successfully!');

        // Start checking the stream status
        const id = setInterval(() => checkStreamStatus(data.streamId), 2000);
        setIntervalId(id);
      } else {
        setMessage(`Error creating stream: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      setMessage('Error creating stream');
    }
  };

  const checkStreamStatus = async (streamId) => {
    try {
      const response = await fetch(`/api/stream-status?streamId=${streamId}`);
      const data = await response.json();
      if (response.ok) {
        setStatus(data.status);

        // Update the status in MongoDB
        await fetch('/api/update-stream-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ streamId, status: data.status }),
        });

        if (data.status === 'active') {
          clearInterval(intervalId);
        }
      }
    } catch (error) {
      console.error('Error checking stream status:', error);
    }
  };

  const handleDoneStreaming = () => {
    if (status === 'active') {
      setMessage('Stop streaming before finishing.');
      return;
    }

    setStreamTitle('');
    setMessage('');
    setStreamInfo(null);
    setStatus('');
    setAddress('');
    setIntervalId(null);
    router.reload(); // Reset the page
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Start Stream</h1>
      {!streamInfo ? (
        <>
          <input
            type="text"
            placeholder="Enter stream title"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleStartStream}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Start Stream
          </button>
        </>
      ) : (
        <button
          onClick={handleDoneStreaming}
          className={`p-2 text-white rounded ${status === 'active' ? 'bg-gray-500' : 'bg-red-500'}`}
          disabled={status === 'active'}
        >
          Done Streaming
        </button>
      )}

      {message && <p className="mt-4">{message}</p>}

      {streamInfo && (
        <div className="mt-4 space-y-2">
          <p><strong>Stream Title:</strong> {streamTitle}</p>
          <p><strong>RTMP URL:</strong> {streamInfo.rtmpUrl}</p>
          <p><strong>Stream Key:</strong> {streamInfo.streamKey}</p>
          <p><strong>Playback URL:</strong> {streamInfo.playbackUrl}</p>
          <p><strong>Stream ID:</strong> {streamInfo.streamId}</p>
          <p><strong>Playback ID:</strong> {streamInfo.playbackId}</p>
          <p><strong>Created At:</strong> {new Date(streamInfo.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
      <div className="absolute right-0 mr-48 h-56 w-96 bg-black">
        {status === 'active' && streamInfo && (
          <iframe
            src={`https://lvpr.tv?v=${streamInfo.playbackId}`}
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            frameBorder="0"
            className="h-56 w-96"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default StartStream;
