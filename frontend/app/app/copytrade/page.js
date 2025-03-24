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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {

    setIsClient(true);
  }, []);

  if (!isClient) {

    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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