"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hls from 'hls.js';
import detectEthereumProvider from '@metamask/detect-provider';

const StartStream = () => {
  const [streamTitle, setStreamTitle] = useState('');
  const [message, setMessage] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
        setMessage(`Stream created successfully!`);

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
        if (data.status === 'active') {
          clearInterval(intervalId);
        }
      }
    } catch (error) {
      console.error('Error checking stream status:', error);
    }
  };

  useEffect(() => {
    if (streamInfo && streamInfo.playbackUrl) {
      const video = document.getElementById('video');
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamInfo.playbackUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
          setIsPlaying(true);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamInfo.playbackUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play();
          setIsPlaying(true);
        });
      }
    }
  }, [streamInfo]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Start Stream</h1>
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
      
      {message && <p className="mt-4">{message}</p>}
      
      {streamInfo && (
        <div className="mt-4 space-y-2">
          <p><strong>RTMP URL:</strong> {streamInfo.rtmpUrl}</p>
          <p><strong>Stream Key:</strong> {streamInfo.streamKey}</p>
          <p><strong>Playback URL:</strong> {streamInfo.playbackUrl}</p>
          <p><strong>Stream ID:</strong> {streamInfo.streamId}</p>
          <p><strong>Created At:</strong> {new Date(streamInfo.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}
      
      {isPlaying && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Live Stream</h2>
          <video id="video" controls className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default StartStream;
