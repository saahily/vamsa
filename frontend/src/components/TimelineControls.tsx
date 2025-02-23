import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FastForward, Pause, Play, Rewind } from 'lucide-react';

interface TimelineControlsProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  isPlaying?: boolean;
  onYearChange: (year: number) => void;
  onPlayPause?: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  minYear,
  maxYear,
  currentYear,
  isPlaying = false,
  onYearChange,
  onPlayPause = () => {},
}) => {
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentYear.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        onYearChange(Math.min(currentYear + 1, maxYear));
      }, 1000);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentYear, maxYear, onYearChange]);

  // Auto-pause when reaching the end
  useEffect(() => {
    if (currentYear >= maxYear && isPlaying && onPlayPause) {
      onPlayPause();
    }
  }, [currentYear, maxYear, isPlaying, onPlayPause]);

  // Update edit value when currentYear changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(currentYear.toString());
    }
  }, [currentYear, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStepYear = (step: number) => {
    const newYear = Math.min(Math.max(currentYear + step, minYear), maxYear);
    onYearChange(newYear);
  };

  const handleJumpYear = (direction: 'start' | 'end') => {
    onYearChange(direction === 'start' ? minYear : maxYear);
  };

  const handleYearClick = () => {
    if (!isPlaying) {
      setIsEditing(true);
    }
  };

  const handleYearSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const newYear = Math.min(Math.max(parseInt(editValue) || minYear, minYear), maxYear);
    onYearChange(newYear);
    setIsEditing(false);
  };

  const handleYearBlur = () => {
    handleYearSubmit();
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-xl border border-slate-700/50">
      <div className="flex items-center gap-4">
        {/* Jump to start */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleJumpYear('start')}
          className="text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPlaying}
        >
          <Rewind size={20} />
        </motion.button>

        {/* Step backward */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStepYear(-1)}
          className="text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPlaying || currentYear <= minYear}
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className={`${
            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-full p-2 shadow-lg ${
            isPlaying ? 'shadow-red-500/20' : 'shadow-blue-500/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={currentYear >= maxYear}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        {/* Current year display/input */}
        <div className="w-24 text-center">
          {isEditing ? (
            <form onSubmit={handleYearSubmit}>
              <input
                ref={inputRef}
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleYearBlur}
                min={minYear}
                max={maxYear}
                className="w-24 bg-transparent text-center font-serif text-2xl font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
              />
            </form>
          ) : (
            <motion.span
              key={currentYear}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-serif text-2xl font-bold bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent cursor-pointer"
              style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
              onClick={handleYearClick}
            >
              {currentYear}
            </motion.span>
          )}
        </div>

        {/* Step forward */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleStepYear(1)}
          className="text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPlaying || currentYear >= maxYear}
        >
          <ChevronRight size={24} />
        </motion.button>

        {/* Jump to end */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleJumpYear('end')}
          className="text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPlaying}
        >
          <FastForward size={20} />
        </motion.button>
      </div>
    </div>
  );
};