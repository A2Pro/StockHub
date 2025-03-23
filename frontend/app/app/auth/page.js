import React, { useState } from "react";
import { motion } from "framer-motion";
import { redirectTo } from "../utils/redirect";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("error");

    // Client-side validation
    if (!email || !password || !retypePassword) {
      setMessage("All fields are required");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Password matching
    if (password !== retypePassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9284/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "success") {
        setMessage("Account created successfully! Redirecting to login...");
        setMessageType("success");
        
        // Use the redirect utility with 2 second delay
        redirectTo("/login", 2000, 
          // Success callback
          () => console.log("Redirection initiated"), 
          // Error callback
          (error) => {
            console.error("Redirect failed:", error);
            setMessage("Redirect failed. Please click the Sign in link below.");
          }
        );
        
      } else if (data.message === "username_taken") {
        setMessage("Email already in use. Please use a different email or try to login.");
      } else if (data.message === "missing_fields") {
        setMessage("Please fill in all required fields.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    } catch (error) {
      setMessage("Connection error. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      transition={{ staggerChildren: 0.05 }}
      viewport={{ once: true }}
      className="flex items-center justify-center min-h-screen bg-black"
    >
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <motion.h1 variants={primaryVariants} className="text-2xl font-semibold mb-6 text-center">
          Sign In
        </motion.h1>

        <form onSubmit={onSubmit}>
          <motion.div variants={primaryVariants} className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </motion.div>

          {message && (
            <motion.p variants={primaryVariants} className="text-sm text-red-500 mb-4 text-center">
              {message}
            </motion.p>
          )}

          <motion.button
            variants={primaryVariants}
            type="submit"
            disabled={isLoading}
            className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </motion.button>

          {message && (
            <motion.p
              variants={primaryVariants}
              className={`mb-2 mt-1 text-center text-sm ${
                messageType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </motion.p>
          )}

          <motion.p variants={primaryVariants} className="text-xs text-center">
            Already have an account?{" "}
            <a 
              className="text-indigo-600 underline" 
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                redirectTo("/login");
              }}
            >
              Sign in
            </a>
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
};

const primaryVariants = {
  initial: { y: 25, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default Form;