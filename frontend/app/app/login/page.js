"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-black">
      <Logo />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_600px]">
        <LoginForm />
        <SupplementalContent />
      </div>
    </section>
  );
}

const LoginForm = () => {
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
  
    if (!email || !password) {
      setMessage("All fields are required");
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
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
  
        localStorage.setItem("user", JSON.stringify({ email: data.username || email }));
        localStorage.setItem("isLoggedIn", "true");
  
        // Set email in a cookie (expires in 7 days)
        document.cookie = `email=${email}; max-age=${7 * 24 * 60 * 60}; path=/`;
  
        setTimeout(() => {
          try {
            console.log("Redirecting to dashboard...");
            window.location.replace("/dashboard");
          } catch (error) {
            console.error("Redirection error:", error);
            window.location.href = "/dashboard";
          }
        }, 1500);
      } else if (data.message === "user_not_found") {
        setMessage("No account found with this email. Please sign up first.");
      } else if (data.message === "invalid_password") {
        setMessage("Incorrect password. Please try again.");
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
      className="flex items-center justify-center pb-4 pt-20 md:py-20"
    >
      <div className="mx-auto my-auto max-w-lg px-4 md:pr-0">
        <motion.h1
          variants={primaryVariants}
          className="mb-2 text-center text-4xl font-semibold"
        >
          Log in to your account
        </motion.h1>
        <motion.p variants={primaryVariants} className="mb-8 text-center">
          Welcome back
        </motion.p>

        <form onSubmit={onSubmit} className="w-full">
          <motion.div variants={primaryVariants} className="mb-2 w-full">
            <label htmlFor="email-input" className="mb-1 inline-block text-sm font-medium">
              Email<span className="text-red-600">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-6 w-full">
            <label htmlFor="password-input" className="mb-1 inline-block text-sm font-medium">
              Password<span className="text-red-600">*</span>
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
            />
            <div className="mt-1 text-right">
              <a href="#" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </motion.div>

          <motion.button
            variants={primaryVariants}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={isLoading}
            className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Logging in..." : "Login"}
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
            Don't have an account?{" "}
            <a className="text-indigo-600 underline" href="/signup">
              Sign up
            </a>
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
};

const SupplementalContent = () => {
  return (
    <div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-slate-950 md:h-[calc(100vh_-_2rem)]">
      <img
        alt="An example image"
        src="/auth/image.png"
        className="h-full w-full bg-white object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
      />
      <div className="absolute right-2 top-4 z-10">
        <FiArrowUpRight className="rotate-45 text-6xl text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
      </div>
      <motion.div
        initial="initial"
        whileInView="animate"
        transition={{ staggerChildren: 0.05 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8"
      >
        <motion.h2
          className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl"
          variants={primaryVariants}
        >
          Welcome Back
          <br />
          to Your Account
        </motion.h2>
      </motion.div>
    </div>
  );
};

const Logo = () => {
  return (
    <svg
      width="50"
      height="39"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-[50%] top-4 -translate-x-[50%] fill-slate-950 md:left-4 md:-translate-x-0"
    >
      <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"></path>
      <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"></path>
    </svg>
  );
};

const primaryVariants = {
  initial: { y: 25, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};