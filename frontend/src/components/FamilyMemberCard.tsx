import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BellRing as Ring } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FamilyMember } from '../types/family';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onClick?: (member: FamilyMember) => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const imageVariants = {
    initial: { rotateY: 0 },
    hover: { 
      rotateY: 360,
      transition: { 
        duration: 1,
        ease: "easeInOut"
      } 
    }
  };

  const handleClick = () => {
    if (onClick) onClick(member);
    navigate(`/member/${member.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-lg shadow-lg p-4 w-48 cursor-pointer transition-all duration-300 ${
        isHovered ? 'bg-slate-800/80' : 'bg-slate-900/50'
      } backdrop-blur-lg border border-slate-700/50`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={member.id}
    >
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          variants={imageVariants}
          style={{ perspective: "1000px" }}
        >
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border-2 border-blue-500/30">
              <User className="w-12 h-12 text-blue-400" />
            </div>
          )}
        </motion.div>
        <h3 className="font-serif font-semibold text-white text-lg">
          {isHovered ? member.teluguName : member.name}
        </h3>
        <p className="text-sm text-slate-400 font-serif">{member.birthYear}</p>
        {member.partnerId && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Ring size={12} />
            <span>{member.marriageYear}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};