"use client";

import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Welcome</h1>
        <p className="mt-4 text-center text-lg">Add your content here.</p>
        {/* Add more content as needed */}
      </main>
    </div>
  );
}
