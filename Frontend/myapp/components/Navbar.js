"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLoginRedirect = () => {
    router.push('/metaMaskLogin');
  };

  const handleStartStreamRedirect = () => {
    router.push('/startStream');
  };

  const handleWatchStreamRedirect = () => {
    router.push('/watchStream'); // Redirect to the Watch Stream page
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        {isClient && (
          <button
            onClick={handleLoginRedirect}
            className="p-2 bg-blue-500 hover:bg-blue-700 rounded"
          >
            Login with MetaMask
          </button>
        )}
        <button
          onClick={handleStartStreamRedirect}
          className="p-2 bg-green-500 hover:bg-green-700 rounded"
        >
          Start Stream
        </button>
        <button
          onClick={handleWatchStreamRedirect}
          className="p-2 bg-red-500 hover:bg-red-700 rounded"
        >
          Watch Stream
        </button>
      </div>
    </nav>
  );
}
