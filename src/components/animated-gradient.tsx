"use client";

import { useEffect, useState } from "react";

export function AnimatedGradient() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -inset-[100px] opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-pink-500/10 blur-[100px] [animation-delay:2s]" />
      <div className="absolute bottom-1/4 left-1/3 h-[350px] w-[350px] animate-pulse rounded-full bg-indigo-500/10 blur-[90px] [animation-delay:4s]" />
    </div>
  );
}

export const floatingBlobVariants = {
  animate: {
    y: [0, -20, 0, 15, 0],
    x: [0, 10, -10, 5, 0],
    rotate: [0, 5, -5, 3, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
