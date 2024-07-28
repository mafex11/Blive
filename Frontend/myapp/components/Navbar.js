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
    router.push('/watch'); // Redirect to the Watch Stream page
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-2xl font-bold">YourApp</div>
        <div className="flex space-x-4">
          {isClient && (
            <button
              onClick={handleLoginRedirect}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md transition"
            >
              Login with MetaMask
            </button>
          )}
          <button
            onClick={handleStartStreamRedirect}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-md transition"
          >
            Start Stream
          </button>
          <button
            onClick={handleWatchStreamRedirect}
            className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-md transition"
          >
            Watch Stream
          </button>
        </div>
      </div>
    </nav>
  );
}
