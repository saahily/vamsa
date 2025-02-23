import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';

interface TimelineScrollProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
}

export const TimelineScroll: React.FC<TimelineScrollProps> = ({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const scrollY = useMotionValue(0);
  const yearRange = maxYear - minYear;
  const scrollHeight = 500; // Fixed scroll height

  // Transform scroll position to year
  const currentYearMotion = useTransform(
    scrollY,
    [0, scrollHeight],
    [minYear, maxYear]
  );

  // Spring animation for the magnified year
  const springYear = useSpring(currentYear, {
    stiffness: 300,
    damping: 30
  });

  // Update year when scrolling
  useEffect(() => {
    const unsubscribe = currentYearMotion.onChange((latest) => {
      const roundedYear = Math.round(latest);
      if (roundedYear !== currentYear) {
        onYearChange(roundedYear);
        springYear.set(roundedYear);
      }
    });
    return unsubscribe;
  }, [currentYearMotion, onYearChange, currentYear, springYear]);

  // Initialize scroll position based on current year
  useEffect(() => {
    const initialY = ((currentYear - minYear) / yearRange) * scrollHeight;
    scrollY.set(initialY);
    springYear.set(currentYear);
  }, [currentYear, minYear, yearRange, scrollY, springYear]);

  // Generate year markers
  const yearMarkers = Array.from(
    { length: yearRange + 1 },
    (_, i) => minYear + i
  );

  // Animate to specific year
  const animateToYear = useCallback((year: number) => {
    const targetY = ((year - minYear) / yearRange) * scrollHeight;
    animate(scrollY, targetY, {
      type: "spring",
      stiffness: 100,
      damping: 20
    });
    springYear.set(year);
  }, [minYear, yearRange, scrollY, springYear]);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 h-[500px] flex items-center">
      {/* Magnified year display */}
      <motion.div
        className="absolute -left-2 -translate-x-full font-serif"
        style={{
          y: scrollY,
          filter: isDragging ? 'none' : 'blur(0.5px)',
        }}
      >
        <motion.div
          className="relative flex items-center justify-end pr-4"
          style={{
            scale: isDragging ? 1.2 : 1,
            transition: 'scale 0.2s ease-out'
          }}
        >
          <motion.span
            className="text-4xl font-bold bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          >
            {Math.round(springYear.get())}
          </motion.span>
        </motion.div>
      </motion.div>

      <div className="relative h-full flex items-center">
        {/* Timeline line with glow effect */}
        <div className="absolute left-3 h-full w-0.5 bg-slate-700/50 rounded overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
            style={{
              y: useTransform(scrollY, 
                [0, scrollHeight / 2, scrollHeight],
                ['-100%', '0%', '100%']
              )
            }}
          />
        </div>

        {/* Year markers */}
        <div className="relative h-full">
          {yearMarkers.map((year) => {
            const y = ((year - minYear) / yearRange) * scrollHeight;
            const isMajor = year % 5 === 0;
            const isCurrentYear = year === Math.round(currentYearMotion.get());

            return (
              <motion.div
                key={year}
                className="absolute flex items-center gap-2"
                style={{ 
                  top: y,
                  opacity: useTransform(
                    currentYearMotion,
                    [year - 2, year, year + 2],
                    [0.3, 1, 0.3]
                  )
                }}
              >
                <motion.div
                  className={`h-0.5 transition-colors ${
                    isMajor ? 'w-3' : 'w-2'
                  } ${
                    isCurrentYear ? 'bg-blue-400' : 'bg-slate-600'
                  }`}
                  style={{
                    scaleX: useTransform(
                      currentYearMotion,
                      [year - 1, year, year + 1],
                      [1, 1.5, 1]
                    )
                  }}
                />
                {isMajor && (
                  <motion.span
                    className={`font-serif text-sm transition-colors ${
                      isCurrentYear ? 'text-blue-400' : 'text-slate-400'
                    }`}
                    style={{
                      scale: useTransform(
                        currentYearMotion,
                        [year - 1, year, year + 1],
                        [1, 1.2, 1]
                      )
                    }}
                  >
                    {year}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Draggable handle with glow effect */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: scrollHeight }}
          dragElastic={0}
          dragMomentum={false}
          style={{ y: scrollY }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="absolute left-0 w-8 flex items-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2 }}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 flex items-center justify-center"
            animate={{
              boxShadow: isDragging
                ? '0 0 25px rgba(59, 130, 246, 0.8)'
                : '0 0 15px rgba(59, 130, 246, 0.5)'
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-white"
              animate={{
                scale: isDragging ? 1.2 : 1
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};