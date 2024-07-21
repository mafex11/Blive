import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

export default function MetaMaskLogin() {
  const [userName, setUserName] = useState('');
  const [emailId, setEmailId] = useState(''); // New state for email
  const [fullName, setFullName] = useState(''); // New state for full name
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Use useEffect to run client-specific code
  useEffect(() => {
    async function initializeProvider() {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        console.log('MetaMask provider detected:', detectedProvider);
        setProvider(detectedProvider);
      } else {
        console.error('MetaMask not detected');
      }
    }
    initializeProvider();
  }, []);

  const handleLogin = async () => {
    if (provider) {
      if (!userName.trim() || !emailId.trim() || !fullName.trim()) {
        setErrorMessage('All fields are required');
        return;
      }

      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        setAddress(userAddress);
        setErrorMessage(''); // Clear any previous error messages

        console.log('Connected MetaMask address:', userAddress);

        // Save user data to MongoDB
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userAddress, userName, emailId, fullName }),
        });

        if (response.ok) {
          const user = await response.json();
          console.log('User registered in MongoDB:', user);
        } else {
          const errorText = await response.text();
          console.error('Failed to register user in MongoDB:', errorText);
          setErrorMessage('Failed to register user');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        setErrorMessage('Error connecting to MetaMask');
      }
    } else {
      console.error('MetaMask is not installed or Ethereum provider is not available');
      setErrorMessage('MetaMask is not installed or Ethereum provider is not available');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="text"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Enter your email ID"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Enter your user name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleLogin}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Login with MetaMask
      </button>
      {address && <p>Address: {address}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
