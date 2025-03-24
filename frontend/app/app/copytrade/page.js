'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import components with browser APIs with ssr disabled
const Navbar = dynamic(() => import('../components/navbar.js'), {
  ssr: false
});

const Slide = dynamic(() => import('../components/slide.js'), {
  ssr: false
});

export default function SlideInAuth() {
  // Add client-side only rendering check
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This code only runs in the browser after component mounts
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a simple loading state when rendering on server
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Actual component rendering - only happens client-side
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="z-10 w-50 bg-white text-black shadow-lg rounded-r-lg">
        <Navbar />
      </div>

      {/* Main Content (Slide) */}
      <div className="flex-1 overflow-auto p-8 bg-black rounded-l-lg shadow-lg">
        <div className="h-full flex flex-col justify-center items-center">
          <Slide />
        </div>
      </div>
    </div>
  );
}