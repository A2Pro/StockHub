"use client";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

export const RoundedDrawerNavExample = () => {
  return (
    <div className="bg-neutral-950">
      <RoundedDrawerNav
        links={[
          {
            title: "Product",
            sublinks: [
              { title: "Manual Trade", href: "/manualTrade" },
              { title: "AI Trade", href: "/aiTrade" },
            ],
          },
          {
            title: "About",
            sublinks: [
              { title: "Team", href: "#" },
              { title: "Contact", href: "#" },
            ],
          },
        ]}
        navBackground="bg-neutral-950"
        bodyBackground="bg-black"
      >
        {/* Landing Page Content */}
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-5xl font-bold text-purple-500 mb-4">Welcome to StockHub</h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            Smart, modern trading—whether you're making your own moves or using AI assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
            <Link href="/manualTrade">
              <div className="bg-[#1e1b2e] hover:bg-purple-700 transition-colors p-6 rounded-2xl cursor-pointer shadow-xl">
                <h2 className="text-2xl font-semibold mb-2 text-white">Manual Trading</h2>
                <p className="text-gray-400 text-sm">Input and manage your trades with precision and full control.</p>
              </div>
            </Link>
            <Link href="/aiTrade">
              <div className="bg-[#1e1b2e] hover:bg-purple-700 transition-colors p-6 rounded-2xl cursor-pointer shadow-xl">
                <h2 className="text-2xl font-semibold mb-2 text-white">AI Trading Assistant</h2>
                <p className="text-gray-400 text-sm">Let AI help you detect trends and optimize your trades.</p>
              </div>
            </Link>
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
  }, [hovered]);

  return (
    <>
      <nav onMouseLeave={() => setHovered(null)} className={`${navBackground} p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Logo />
            <DesktopLinks
              links={links}
              setHovered={setHovered}
              hovered={hovered}
              activeSublinks={activeSublinks}
            />
          </div>
          <Link
            href="/auth"
            className="hidden rounded-md bg-indigo-500 px-3 py-1.5 text-sm text-neutral-50 transition-colors hover:bg-indigo-600 md:block"
          >
            <span className="font-bold">Get started - </span> no CC required
          </Link>
          <button
            onClick={() => setMobileNavOpen((pv) => !pv)}
            className="mt-0.5 block text-2xl text-neutral-50 md:hidden"
          >
            <FiMenu />
          </button>
        </div>
        <MobileLinks links={links} open={mobileNavOpen} />
      </nav>
      <motion.main layout className={`${navBackground} px-2 pb-2`}>
        <div className={`${bodyBackground} rounded-3xl`}>{children}</div>
      </motion.main>
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
    className="fill-neutral-50"
  >
    <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
    <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
  </svg>
);

const DesktopLinks = ({ links, setHovered, hovered, activeSublinks }) => (
  <div className="ml-9 mt-0.5 hidden md:block">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4 py-6"
        >
          {activeSublinks.map((l) => (
            <a
              className="block text-2xl font-semibold text-neutral-50 transition-colors hover:text-neutral-400"
              href={l.href}
              key={l.title}
            >
              {l.title}
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileLinks = ({ links, open }) => (
  <AnimatePresence mode="popLayout">
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-2 gap-6 py-6 md:hidden"
      >
        {links.map((l) => (
          <div key={l.title} className="space-y-1.5">
            <span className="text-md block font-semibold text-neutral-50">{l.title}</span>
            {l.sublinks.map((sl) => (
              <a className="text-md block text-neutral-300" href={sl.href} key={sl.title}>
                {sl.title}
              </a>
            ))}
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const TopLink = ({ children, setHovered, title }) => (
  <span
    onMouseEnter={() => setHovered(title)}
    className="cursor-pointer text-neutral-50 transition-colors hover:text-neutral-400"
  >
    {children}
  </span>
);

export default RoundedDrawerNavExample;


