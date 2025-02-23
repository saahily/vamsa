import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Star field configuration
const NUM_STARS = 150;
const STAR_COLORS = [
  'rgba(255, 255, 255, 0.95)',  // Brighter white
  'rgba(255, 255, 255, 0.85)',  // Bright white
  'rgba(255, 223, 186, 0.9)',   // Brighter warm
  'rgba(186, 223, 255, 0.9)',   // Brighter cool
];

// Star component with glow effect
const Star = React.memo(({ x, y, size, color, twinkleSpeed, twinkleDelay }: {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleDelay: number;
}) => (
  <>
    {/* Glow effect */}
    <motion.circle
      cx={x}
      cy={y}
      r={size * 2}
      fill={color.replace(')', ', 0.3)')}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: twinkleSpeed,
        delay: twinkleDelay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
      style={{ filter: 'blur(2px)' }}
    />
    {/* Star core */}
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: twinkleSpeed,
        delay: twinkleDelay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
    />
  </>
));

export const StarField = React.memo(() => {
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    twinkleSpeed: number;
    twinkleDelay: number;
  }>>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    const debouncedResize = () => {
      let timeout: NodeJS.Timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateViewport, 100);
      };
    };
    
    window.addEventListener('resize', debouncedResize());
    return () => window.removeEventListener('resize', debouncedResize());
  }, []);

  useEffect(() => {
    if (!viewport.width || !viewport.height) return;

    const newStars = Array.from({ length: NUM_STARS }, (_, i) => ({
      id: i,
      x: Math.random() * viewport.width,
      y: Math.random() * viewport.height,
      size: 0.5 + Math.random() * 1.5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      twinkleSpeed: 3 + Math.random() * 2,
      twinkleDelay: Math.random() * 5,
    }));

    setStars(newStars);
  }, [viewport]);

  return (
    <svg 
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
    >
      {stars.map(star => (
        <Star key={star.id} {...star} />
      ))}
    </svg>
  );
});