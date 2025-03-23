import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

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
        setMessage("");
        // Redirect or navigate to dashboard
        window.location.href = "/dashboard";
      } else if (data.message === "invalid_credentials") {
        setMessage("Invalid email or password.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
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
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Log In
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const primaryVariants = {
  initial: { y: 25, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default LoginForm;
