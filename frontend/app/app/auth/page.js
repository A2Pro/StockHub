"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export const SlideInAuth = () => {
  return (
    <section className="min-h-screen bg-black">
      <Logo />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_600px]">
        <Form />
        <SupplementalContent />
      </div>
    </section>
  );
};

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== retypePassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:9284/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.message === "success") {
        setMessage("Account created successfully!");
        window.location.href("/login");
      } else if (data.message === "username_taken") {
        setMessage("Email already in use.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
          Create your account
        </motion.h1>
        <motion.p variants={primaryVariants} className="mb-8 text-center">
          Try it free for 30 days, no CC required
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

          <motion.div variants={primaryVariants} className="mb-2 w-full">
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
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-4 w-full">
            <label htmlFor="rt-password-input" className="mb-1 inline-block text-sm font-medium">
              Re-type Password<span className="text-red-600">*</span>
            </label>
            <input
              id="rt-password-input"
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              placeholder="Re-type your password"
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-4 flex items-start gap-1.5">
            <input
              type="checkbox"
              id="terms-checkbox"
              className="h-4 w-4 accent-indigo-600"
              required
            />
            <label htmlFor="terms-checkbox" className="text-xs">
              By signing up, I agree to the terms and conditions, privacy policy, and cookie policy
            </label>
          </motion.div>

          <motion.button
            variants={primaryVariants}
            whileTap={{ scale: 0.985 }}
            type="submit"
            className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Sign up
          </motion.button>

          {message && (
            <motion.p
              variants={primaryVariants}
              className="mb-2 mt-1 text-center text-sm text-red-500"
            >
              {message}
            </motion.p>
          )}

          <motion.p variants={primaryVariants} className="text-xs text-center">
            Already have an account?{" "}
            <a className="text-indigo-600 underline" href="#">
              Sign in
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
          Connecting Designers
          <br />
          with Opportunities
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

export default SlideInAuth;
