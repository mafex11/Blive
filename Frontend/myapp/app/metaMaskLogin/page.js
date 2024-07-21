// app/metaMaskLogin/page.js

"use client";
import { useEffect, useState } from 'react';
import MetaMaskLogin from '../../components/MetaMaskLogin';

export default function MetaMaskLoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isClient && <MetaMaskLogin />}
    </div>
  );
}










