"use client";
import React, { useState } from "react";
import Navbar from "../components/navbar.js";
import Slide from "../components/slide.js";

export const SlideInAuth = () => {
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
};

export default SlideInAuth;