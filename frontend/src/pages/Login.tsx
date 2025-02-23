import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { sampleFamilyData } from '../data/sampleData';

const MAX_BRANCHES = 130; 
const MAX_DEPTH = 6; 
const BASE_SPREAD = Math.PI * 0.45;
const CYCLE_DURATION = 20000; 
const GROWTH_PHASE = 0.75;
const FADE_PHASE = 0.2;

// Enhanced star field with brighter colors and more stars
const NUM_STARS = 150; 
const STAR_COLORS = [
  'rgba(255, 255, 255, 0.95)',  // Brighter white
  'rgba(255, 255, 255, 0.85)',  // Bright white
  'rgba(255, 223, 186, 0.9)',   // Brighter warm
  'rgba(186, 223, 255, 0.9)',   // Brighter cool
];

const getNormalRandom = (mean: number, stdDev: number, seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  const u = Math.abs(x - Math.floor(x));
  const v = Math.abs(Math.sin(seed * 78.233) * 43758.5453 - Math.floor(Math.sin(seed * 78.233) * 43758.5453));
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stdDev + mean;
};

// Enhanced Star component with glow effect
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

const StarField = React.memo(() => {
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
      size: 0.5 + Math.random() * 1.5, // Larger size range
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

// Enhanced Branch component with glow effect
const Branch = React.memo(({ branch, progress, opacity, seed }: {
  branch: any;
  progress: number;
  opacity: number;
  seed: number;
}) => {
  const currentEnd = useMemo(() => ({
    x: branch.start.x + (branch.end.x - branch.start.x) * progress,
    y: branch.start.y + (branch.end.y - branch.start.y) * progress
  }), [branch.start.x, branch.start.y, branch.end.x, branch.end.y, progress]);

  const style = useMemo(() => {
    const baseHue = (seed * 137.508) % 360;
    const hue = (baseHue + branch.depth * 15) % 360;
    const saturation = 85 - branch.depth * 5;
    const lightness = 60 - branch.depth * 3;
    return {
      stroke: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.7})`, // Reduced opacity
      strokeWidth: Math.max(1, 6 - branch.depth * 0.7),
      filter: 'blur(0.5px)', // Subtle blur
    };
  }, [seed, branch.depth, opacity]);

  // Glow effect
  const glowStyle = useMemo(() => ({
    ...style,
    strokeWidth: style.strokeWidth * 2,
    stroke: style.stroke.replace(')', ', 0.2)'),
    filter: 'blur(3px)',
  }), [style]);

  return (
    <>
      {/* Glow layer */}
      <line
        x1={branch.start.x}
        y1={branch.start.y}
        x2={currentEnd.x}
        y2={currentEnd.y}
        style={glowStyle}
        strokeLinecap="round"
      />
      {/* Main branch */}
      <line
        x1={branch.start.x}
        y1={branch.start.y}
        x2={currentEnd.x}
        y2={currentEnd.y}
        style={style}
        strokeLinecap="round"
      />
    </>
  );
});

// Add these interfaces at the top of the file
interface Branch {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  depth: number;
  childCount: number;
}

interface Viewport {
  width: number;
  height: number;
}

const TreeAnimation = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [animationPhase, setAnimationPhase] = useState({ growth: 0, opacity: 1 });
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  const seedRef = useRef(Math.random() * 10000);
  const lastUpdateTime = useRef(0);
  const frameSkip = useRef(0);

  // Move getChildCount inside the component
  const getChildCount = useCallback((depth: number, seed: number): number => {
    const maxChildren = Math.max(1, 5 - Math.floor(depth * 0.7));
    const count = Math.round(getNormalRandom(2.2, 1.0, seed + depth));
    return Math.min(Math.max(count, 0), maxChildren);
  }, []);

  // Move generateTree inside the component
  const generateTree = useCallback((seed: number): Branch[] => {
    if (!viewport.width || !viewport.height) return [];
    let branchCount = 0;

    const availableWidth = viewport.width * 0.4;
    const startX = availableWidth * 0.4;
    const startY = viewport.height / 2;
    const initialLength = Math.min(availableWidth, viewport.height) * 0.2;

    const generateBranches = (
      x: number,
      y: number, 
      angle: number,
      depth: number,
      length: number,
      seed: number,
      verticalBias: number = 0
    ): Branch[] => {
      if (depth >= MAX_DEPTH || branchCount >= MAX_BRANCHES) return [];

      const heightRatio = y / viewport.height;
      const centerBias = (heightRatio - 0.5) * 0.4;
      const curvedAngle = angle + centerBias + verticalBias;
      const lengthVariation = 0.95 + (Math.abs(Math.sin(seed * 43758.5453)) * 0.1);
      const newLength = (depth === 0) ? length : length * (0.8 - depth * 0.05) * lengthVariation;
      const waveFactor = Math.sin(depth * 1.2 + seed) * 0.15;

      const endX = x + Math.sin(curvedAngle + waveFactor) * length;
      const endY = y - Math.cos(curvedAngle + waveFactor) * length;

      if (depth > 0) {
        const margin = 50;
        const maxX = viewport.width * 0.45;
        if (endX < margin || endX > maxX || 
            endY < margin || endY > viewport.height - margin) {
          return [];
        }
      }

      branchCount++;
      
      if (branchCount >= MAX_BRANCHES) {
        return [{
          start: { x, y },
          end: { x: endX, y: endY },
          depth,
          childCount: 0,
          id: `${seed}-${depth}-${x}-${y}`
        }];
      }

      const childCount = getChildCount(depth, seed + depth);
      const subBranches = [];

      if (childCount > 0 && depth < MAX_DEPTH - 1) {
        const spreadMultiplier = 1 - Math.abs(heightRatio - 0.5) * 0.5;
        const spreadVariation = getNormalRandom(1, 0.2, seed + depth);
        const totalSpread = BASE_SPREAD * spreadMultiplier * spreadVariation * (1 + (childCount - 2) * 0.2);
        const angleStep = totalSpread / (childCount - 1 || 1);
        const startAngle = angle - (totalSpread / 2);

        const childAngles = Array.from({ length: childCount }, (_, i) => ({
          angle: startAngle + angleStep * i,
          priority: Math.abs(i - (childCount - 1) / 2)
        })).sort((a, b) => a.priority - b.priority);

        for (const { angle: childAngle } of childAngles) {
          if (branchCount >= MAX_BRANCHES) break;
          
          const newVerticalBias = verticalBias + 
            (y < viewport.height * 0.4 ? 0.1 : -0.1) * (depth + 1);

          subBranches.push(...generateBranches(
            endX,
            endY,
            childAngle,
            depth + 1,
            newLength,
            seed + childAngle + depth,
            newVerticalBias + waveFactor
          ));
        }
      }

      return [{
        start: { x, y },
        end: { x: endX, y: endY },
        depth,
        childCount,
        id: `${seed}-${depth}-${x}-${y}`
      }, ...subBranches];
    };

    const numInitialBranches = Math.min(Math.max(2, Math.round(getNormalRandom(3, 1.2, seed))), 6);
    const initialBranches = [];

    for (let i = 0; i < numInitialBranches; i++) {
      const randomAngle = (i * (2 * Math.PI / numInitialBranches)) + 
                         getNormalRandom(0, 0.3, seed + i);
      const lengthVariation = 0.8 + (Math.abs(Math.sin(seed * i)) * 0.4);
      const branchLength = initialLength * lengthVariation;
      initialBranches.push(...generateBranches(startX, startY, randomAngle, 0, branchLength, seed + i, 0));
    }

    return initialBranches;
  }, [viewport, getChildCount]);

  useEffect(() => {
    const updateViewport = () => {
      requestAnimationFrame(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight
        });
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
    return () => {
      window.removeEventListener('resize', debouncedResize());
    };
  }, []);

  useEffect(() => {
    let startTime: number | null = null;
    let lastCycle = -1;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const currentCycle = Math.floor((timestamp - startTime) / CYCLE_DURATION);

      if (currentCycle !== lastCycle) {
        lastCycle = currentCycle;
        seedRef.current = Math.random() * 10000;
        setBranches(generateTree(seedRef.current));
      }

      const cycleProgress = ((timestamp - startTime) % CYCLE_DURATION) / CYCLE_DURATION;
      let growth = 0;
      let opacity = 1;

      if (cycleProgress < GROWTH_PHASE) {
        growth = cycleProgress / GROWTH_PHASE;
      } else if (cycleProgress > (1 - FADE_PHASE)) {
        growth = 1;
        opacity = 1 - ((cycleProgress - (1 - FADE_PHASE)) / FADE_PHASE);
      } else {
        growth = 1;
      }

      setAnimationPhase({ growth, opacity });
      animationRef.current = requestAnimationFrame(animate);
    };

    setBranches(generateTree(seedRef.current));
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateTree]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),rgba(15,23,42,0))]" />
        </div>
        <StarField />
        <svg 
          width="100%" 
          height="100%" 
          className="absolute inset-0"
          style={{ willChange: 'transform' }}
        >
          {branches.map((branch) => {
            const depthStartTime = branch.depth / MAX_DEPTH;
            const depthDuration = 1 / MAX_DEPTH;
            const normalizedTime = animationPhase.growth;
            
            let progress = 0;
            if (normalizedTime > depthStartTime) {
              progress = Math.min(1, (normalizedTime - depthStartTime) / depthDuration);
            }
            
            if (progress <= 0) return null;

            return (
              <Branch
                key={branch.id}
                branch={branch}
                progress={progress}
                opacity={animationPhase.opacity}
                seed={seedRef.current}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export function Login() {
  const navigate = useNavigate();
  const [username, setUsernameInput] = useState('');
  const { setUsername } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamically get all usernames from sampleData
    const validUsernames = Object.values(sampleFamilyData.members)
      .filter(member => member.username)
      .map(member => member.username!);

    if (validUsernames.includes(username)) {
      setUsername(username);
      navigate('/family-tree');
    } else {
      alert(`Please use one of these usernames: ${validUsernames.join(', ')}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen">
        <TreeAnimation />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black/30 backdrop-blur-lg relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-5xl font-title italic font-semibold text-white tracking-wide">
              <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">
                Vaṃśa
              </span>
            </h2>
            <p className="mt-2 text-slate-300 font-serif text-lg">Sign in to explore your family history</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}