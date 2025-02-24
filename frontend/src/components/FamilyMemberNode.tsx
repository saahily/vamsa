import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Focus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FamilyMember } from '../types/family';

interface FamilyMemberNodeProps extends NodeProps {
  data: {
    member: FamilyMember;
    nodeType?: 'ancestor' | 'descendant' | 'focused' | 'partner' | null;
    onFocus: (memberId: string | null) => void;
    isFocused: boolean;
    currentYear: number;
    isCurrentUser: boolean;
  };
}

export function FamilyMemberNode({ data: { member, nodeType, onFocus, isFocused, currentYear, isCurrentUser }, selected }: FamilyMemberNodeProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const getBorderColor = () => {
    if (isCurrentUser) return 'border-transparent';
    if (nodeType === 'ancestor') return 'border-amber-500/50';
    if (nodeType === 'descendant') return 'border-emerald-500/50';
    if (nodeType === 'focused') return 'border-blue-500/50';
    if (nodeType === 'partner') return 'border-pink-500/50';
    return selected ? 'border-blue-500/50' : 'border-slate-700/50';
  };

  const getHoverBorderColor = () => {
    if (isCurrentUser) return '';
    if (nodeType === 'ancestor') return 'group-hover:border-amber-500/70';
    if (nodeType === 'descendant') return 'group-hover:border-emerald-500/70';
    if (nodeType === 'focused') return 'group-hover:border-blue-500/70';
    if (nodeType === 'partner') return 'group-hover:border-pink-500/70';
    return 'group-hover:border-blue-500/30';
  };

  const getBackgroundColor = () => {
    if (nodeType === 'ancestor') return 'bg-amber-900/20';
    if (nodeType === 'descendant') return 'bg-emerald-900/20';
    if (nodeType === 'focused') return 'bg-blue-900/20';
    if (nodeType === 'partner') return 'bg-pink-900/20';
    return 'bg-slate-900/50';
  };

  const getWrapperClass = () => {
    if (isCurrentUser) {
      return 'before:absolute before:inset-0 before:-z-10 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-blue-400/40 before:via-purple-400/40 before:to-blue-400/40 before:bg-[length:200%_100%] before:animate-gradient';
    }
    return '';
  };

  const isDeceased = member.deathYear && parseInt(member.deathYear) <= currentYear;

  const getYearDisplay = () => {
    if (isDeceased) {
      return `${member.birthYear} - ${member.deathYear}`;
    }
    return member.birthYear;
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection handles - hidden but functional */}
      <Handle type="target" position={Position.Top} id="child-top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="parent-bottom" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="marriage-left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="marriage-right" style={{ opacity: 0 }} />

      {/* Focus button */}
      <AnimatePresence>
        {isHovered && !isFocused && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onFocus(member.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-10"
          >
            <Focus size={14} />
          </motion.button>
        )}
        {isFocused && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onFocus(null);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/member/${member.id}`)}
        className={`relative rounded-lg shadow-lg p-3 w-36 cursor-grab active:cursor-grabbing transition-all duration-300 backdrop-blur-lg border ${
          getBorderColor()
        } ${getHoverBorderColor()} ${getBackgroundColor()} ${getWrapperClass()}`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className={`w-16 h-16 rounded-full object-cover border-2 transition-colors ${
                  getBorderColor()
                } ${getHoverBorderColor()} ${
                  isDeceased ? 'grayscale' : ''
                }`}
              />
            ) : (
              <div className={`w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border-2 transition-colors ${
                getBorderColor()
              } ${getHoverBorderColor()}`}>
                <User className="w-10 h-10 text-blue-400" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className={`font-serif font-semibold text-base leading-tight group-hover:text-blue-400 transition-colors ${
              isDeceased ? 'text-slate-300' : 'text-white'
            }`}>
              {isHovered && member.teluguName ? member.teluguName : member.name}
            </h3>
            <p className="text-xs text-slate-400 font-serif mt-0.5">{getYearDisplay()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}