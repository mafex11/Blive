// app/page.js

"use client";


import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-4xl font-bold">Welcome to My App</h1>
        <p className="mt-4">This is the homepage. You can add more content here.</p>
        {/* Add more content as needed */}
      </main>
    </div>
  );
}
