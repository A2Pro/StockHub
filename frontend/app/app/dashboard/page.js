"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from '../components/navbar.js';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
  };

  useEffect(() => {
    const checkAuth = async () => {

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!isLoggedIn || !user.email) {

        window.location.href = "/login";
        return;
      }
      
      try {
        const response = await fetch("http://localhost:9284/verify_auth", {
          method: "GET",
          credentials: "include", 
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
          setUserData(user);
        } else {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(true);
        setUserData(user);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <svg
              width="40"
              height="32"
              viewBox="0 0 50 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4 fill-indigo-600"
            >
              <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"></path>
              <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"></path>
            </svg>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-right">
              <p className="text-sm font-medium text-gray-900">{userData?.email}</p>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
            <button 
              onClick={handleLogout}
              className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["overview", "analytics", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`py-4 px-1 text-sm font-medium ${
                  currentTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="text-lg font-medium text-gray-900">Welcome to your Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            This is where you can manage your account, view analytics, and access your settings.
          </p>
        </motion.div>

        {currentTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {["Visits", "Sales", "Conversion Rate"].map((stat, index) => (
              <div
                key={stat}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h3 className="text-sm font-medium text-gray-500">{stat}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {index === 0 ? "1,245" : index === 1 ? "$12,345" : "3.2%"}
                </p>
                <p className="mt-2 flex items-center text-sm text-green-600">
                  <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M12 7a1 1 0 01-1-1V3.414L5.707 8.707a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0l7 7a1 1 0 01-1.414 1.414L13 3.414V6a1 1 0 01-1 1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span>{index === 0 ? "12%" : index === 1 ? "8%" : "1.2%"} from last month</span>
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {currentTab === "analytics" && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Analytics</h2>
            <p className="text-gray-500">Your analytics data will appear here.</p>
          </div>
        )}

        {currentTab === "settings" && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Account Settings</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800  shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue={userData?.email}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                {isSaved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default Dashboard;