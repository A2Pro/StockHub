import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import useMeasure from "react-use-measure";

const CARD_WIDTH = 350;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
};

const BlogPostCarousel = () => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);
  const [activeTrades, setActiveTrades] = useState({}); // Track active copy trades

  const CARD_BUFFER =
    width > BREAKPOINTS.lg ? 3 : width > BREAKPOINTS.sm ? 2 : 1;

  const CAN_SHIFT_LEFT = offset < 0;

  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (posts.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) {
      return;
    }
    setOffset((pv) => (pv += CARD_SIZE));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) {
      return;
    }
    setOffset((pv) => (pv -= CARD_SIZE));
  };

  const handleCopyTrade = (id) => {
    setActiveTrades((prev) => ({
      ...prev,
      [id]: true, // Mark this post as actively copy trading
    }));
  };

  return (
    <section className="bg-neutral-100 py-8 rounded-xl" ref={ref}>
      <div className="relative overflow-hidden p-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="mb-4 text-4xl font-bold text-black">Choose Who You Want to Copy</h2>

            <div className="flex items-center gap-2">
              <button
                className={`rounded-lg border-[1px] border-neutral-400 bg-black p-1.5 text-2xl text-white transition-opacity ${
                  CAN_SHIFT_LEFT ? "" : "opacity-30"
                }`}
                disabled={!CAN_SHIFT_LEFT}
                onClick={shiftLeft}
              >
                <FiArrowLeft />
              </button>
              <button
                className={`rounded-lg border-[1px] border-neutral-400 bg-black p-1.5 text-2xl text-white transition-opacity ${
                  CAN_SHIFT_RIGHT ? "" : "opacity-30"
                }`}
                disabled={!CAN_SHIFT_RIGHT}
                onClick={shiftRight}
              >
                <FiArrowRight />
              </button>
            </div>
          </div>
          <motion.div
            animate={{
              x: offset,
            }}
            transition={{
              ease: "easeInOut",
            }}
            className="flex"
          >
            {posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  {...post}
                  isCopyTradeActive={activeTrades[post.id] || false}
                  onCopyTrade={() => handleCopyTrade(post.id)}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Post = ({ imgUrl, author, title, description, isCopyTradeActive, onCopyTrade }) => {
  return (
    <div
      className="relative shrink-0 cursor-pointer transition-transform hover:-translate-y-1"
      style={{
        width: CARD_WIDTH,
        marginRight: MARGIN,
      }}
    >
      <img
        src={imgUrl}
        className="mb-3 h-[200px] w-full rounded-lg object-cover"
        alt={`An image for a fake blog post titled ${title}`}
      />
      <span className="rounded-md border-[1px] border-neutral-500 px-1.5 py-1 text-xs uppercase text-black">
        {author}
      </span>
      <p className="mt-1.5 text-lg font-medium text-black">{title}</p>
      <p className="text-sm text-black">{description}</p>
      {/* Add Copy Trade Button */}
      <button
        className={`mt-4 w-full rounded-lg px-4 py-2 text-sm text-white transition-opacity ${
          isCopyTradeActive
            ? "bg-green-600 cursor-not-allowed"
            : "bg-black hover:bg-neutral-800"
        }`}
        onClick={onCopyTrade}
        disabled={isCopyTradeActive}
      >
        {isCopyTradeActive ? "Actively Copy Trading" : "Copy Trade"}
      </button>
    </div>
  );
};

export default BlogPostCarousel;

const posts = [
  {
    id: 1,
    imgUrl: "/congress/rick.png",
    author: "Rick Scott",
    title: "Republican / Senate / Florida",
    description:
      "Rick Scott has a net worth of $550.74M",
  },
  {
    id: 2,
    imgUrl: "/congress/pelosi.png",
    author: "Nancy Pelosi",
    title: "Democratic / House / California",
    description:
      "Nancy Pelosi has a net worth of $255.84M",
  },
  {
    id: 3,
    imgUrl: "/congress/vern.png",
    author: "Vern Buchanan",
    title: "Republican / House / Florida",
    description:
      "Vern Buchanan has a net worth of $249.31M",
  },
  {
    id: 4,
    imgUrl: "/congress/goldman.png",
    author: "Daniel S. Goldman",
    title: "Democratic / House / New York",
    description:
      "Daniel S. Goldman has a net worth of $183.47M",
  },
  {
    id: 5,
    imgUrl: "/congress/tom.png",
    author: "Thomas R. Carper",
    title: "Democratic / Delaware",
    description:
      "Thomas R. Carper has a net worth of $9.70M",
  },
];