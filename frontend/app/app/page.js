"use client";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiTrendingUp, FiBarChart2, FiCpu, FiShield } from "react-icons/fi";
import Link from "next/link";

export const LandingPage = () => {
  return (
    <div className="bg-white">
      <RoundedDrawerNav
        links={[
          {
            title: "Platform",
            sublinks: [
              { title: "Manual Trading", href: "/manualTrade" },
              { title: "AI Trading", href: "/aiTrade" },
              { title: "Talk to the Market", href: "/talktothemarket" },
              { title: "Financial Health", href: "/financialhealth" },
            ],
          },
          {
            title: "Resources",
            sublinks: [
              { title: "Market News", href: "/news" },
              { title: "Learning Center", href: "#" },
            ],
          },
        ]}
        navBackground="bg-white"
        bodyBackground="bg-gray-50"
      >
        {/* Hero Section */}
        <div className="py-20 px-6 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Smart Trading for <span className="text-indigo-600">Everyone</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                StockHub combines powerful trading tools with AI-driven insights to help you make better investment decisions.
              </p>
              
              {/* Large centered Sign Up button */}
              <Link href="/auth">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  Sign Up
                </button>
              </Link>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Link href="/manualTrade">
                <div className="bg-white hover:bg-indigo-50 border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 h-full">
                  <div className="flex items-center mb-4">
                    <FiBarChart2 className="text-indigo-600 text-2xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">Manual Trading</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Take full control of your investments with our intuitive trading interface. Set your own parameters, execute trades with precision, and track your performance in real-time.
                  </p>
                  <p className="text-indigo-600 font-medium">Get started →</p>
                </div>
              </Link>

              <Link href="/aiTrade">
                <div className="bg-white hover:bg-indigo-50 border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 h-full">
                  <div className="flex items-center mb-4">
                    <FiCpu className="text-indigo-600 text-2xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-900">AI Trading</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Leverage our advanced AI algorithms to identify market opportunities. Our AI trading assistant analyzes market trends and provides personalized recommendations based on your risk profile.
                  </p>
                  <p className="text-indigo-600 font-medium">Explore AI features →</p>
                </div>
              </Link>
            </div>

            {/* Additional Features */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">More Ways to Grow Your Portfolio</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6">
                  <FiTrendingUp className="text-indigo-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Market Insights</h3>
                  <p className="text-gray-600">
                    Stay informed with real-time news and data analysis from trusted sources across the financial world.
                  </p>
                </div>
                
                <div className="p-6">
                  <FiShield className="text-indigo-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Health Analysis</h3>
                  <p className="text-gray-600">
                    Upload your bank statements and get personalized financial insights to improve your financial wellness.
                  </p>
                </div>
                
                <div className="p-6">
                  <FiBarChart2 className="text-indigo-500 text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Talk to the Market</h3>
                  <p className="text-gray-600">
                    Ask questions and receive AI-powered insights about market trends, stocks, and investment strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoundedDrawerNav>
    </div>
  );
};

const RoundedDrawerNav = ({ children, navBackground, bodyBackground, links }) => {
  const [hovered, setHovered] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeSublinks = useMemo(() => {
    if (!hovered) return [];
    const link = links.find((l) => l.title === hovered);
    return link ? link.sublinks : [];
  }, [hovered, links]);

  return (
    <>
      <nav onMouseLeave={() => setHovered(null)} className={`${navBackground} p-4 border-b border-gray-200 shadow-sm`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-gray-900">StockHub</span>
            </Link>
            <DesktopLinks
              links={links}
              setHovered={setHovered}
              hovered={hovered}
              activeSublinks={activeSublinks}
            />
          </div>
          <Link
            href="/auth"
            className="hidden rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 md:block"
          >
            Sign Up
          </Link>
          <button
            onClick={() => setMobileNavOpen((pv) => !pv)}
            className="block text-xl text-gray-800 md:hidden"
          >
            <FiMenu />
          </button>
        </div>
        <MobileLinks links={links} open={mobileNavOpen} />
      </nav>
      <main className={`${bodyBackground}`}>
        <div>{children}</div>
      </main>
    </>
  );
};

const Logo = () => (
  <svg
    width="40"
    height="auto"
    viewBox="0 0 50 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-indigo-600"
  >
    <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
    <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
  </svg>
);

const DesktopLinks = ({ links, setHovered, hovered, activeSublinks }) => (
  <div className="ml-9 hidden md:block">
    <div className="flex gap-6">
      {links.map((l) => (
        <TopLink key={l.title} setHovered={setHovered} title={l.title}>
          {l.title}
        </TopLink>
      ))}
    </div>
    <AnimatePresence mode="popLayout">
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-10 bg-white shadow-lg rounded-lg p-6 mt-2 border border-gray-100"
        >
          <div className="grid grid-cols-1 gap-2">
            {activeSublinks.map((l) => (
              <Link
                className="block py-2 px-3 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                href={l.href}
                key={l.title}
              >
                {l.title}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileLinks = ({ links, open }) => (
  <AnimatePresence mode="popLayout">
    {open && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="py-4 px-2 space-y-4 border-t border-gray-200 mt-4">
          {links.map((l) => (
            <div key={l.title} className="space-y-2">
              <span className="text-md block font-semibold text-gray-900">{l.title}</span>
              <div className="space-y-1 pl-3">
                {l.sublinks.map((sl) => (
                  <Link className="block py-1 text-gray-600 hover:text-indigo-600" href={sl.href} key={sl.title}>
                    {sl.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Link href="/auth">
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TopLink = ({ children, setHovered, title }) => (
  <span
    onMouseEnter={() => setHovered(title)}
    className="cursor-pointer text-gray-700 hover:text-indigo-600 font-medium transition-colors"
  >
    {children}
  </span>
);

export default LandingPage;