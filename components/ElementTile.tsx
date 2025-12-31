import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemicalElement } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ElementTileProps {
  element: ChemicalElement;
  onClick: (element: ChemicalElement) => void;
  dimmed?: boolean;
}

export const ElementTile: React.FC<ElementTileProps> = ({ element, onClick, dimmed }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = CATEGORY_COLORS[element.category];

  return (
    <motion.div
      onClick={() => onClick(element)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.15, 
        zIndex: 50,
        boxShadow: `0 0 30px ${color}50`,
        backgroundColor: "rgba(30, 30, 35, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.4)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: dimmed ? 0.2 : 1, 
        scale: 1,
        filter: dimmed ? 'blur(2px) grayscale(80%)' : 'none',
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
      className={`
        relative aspect-square cursor-pointer
        flex flex-col items-center justify-between
        p-1 md:p-1.5
        bg-white/5 backdrop-blur-md 
        border border-white/10
        transition-all duration-300
        group
        rounded-sm
      `}
      style={{
        gridColumn: element.gridX,
        gridRow: element.gridY,
        // Override for special rows (Lanthanides/Actinides) to add gap
        ...(element.gridY >= 9 ? { marginTop: '3rem' } : {})
      }}
    >
        {/* Tooltip */}
        <AnimatePresence>
            {isHovered && (
                <motion.div 
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-max max-w-[150px] pointer-events-none z-[60]"
                >
                     <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-2.5 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-white whitespace-normal leading-tight">{element.name}</span>
                        <span className="text-[10px] font-mono text-neon-cyan mt-1 font-medium">{element.atomic_mass} u</span>
                    </div>
                    {/* Arrow */}
                    <div className="w-2 h-2 bg-black/80 border-r border-b border-white/20 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 backdrop-blur-xl"></div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Inner Wrapper for Clipping Accent Bar */}
        <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
            {/* Top Accent Bar */}
            <div 
                className="absolute top-0 left-0 w-full h-[2px] opacity-60 group-hover:opacity-100 group-hover:h-[3px] transition-all duration-300"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            />
        </div>

        {/* Atomic Number & Mass (Top Left Stacked) */}
        <div className="w-full flex flex-col items-start relative z-10">
            <span className="text-[9px] md:text-[11px] font-mono text-white/40 group-hover:text-white transition-colors font-bold leading-none mb-0.5">
                {element.number}
            </span>
            <span className="text-[7px] md:text-[8px] font-mono text-white/30 group-hover:text-neon-cyan transition-colors tracking-tight leading-none">
                {element.atomic_mass}
            </span>
        </div>

        {/* Symbol (Centered) */}
        <div className="flex-1 flex items-center justify-center -mt-2 w-full relative z-10">
             <span 
                className="text-lg md:text-2xl lg:text-3xl font-bold font-display tracking-tighter transition-transform duration-300 group-hover:scale-110"
                style={{ 
                    color: 'transparent',
                    backgroundImage: `linear-gradient(135deg, #ffffff 40%, ${color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    textShadow: `0 0 20px ${color}30`
                }}
            >
                {element.symbol}
            </span>
        </div>
       
        {/* Name (Bottom) - Explicitly visible */}
        <div className="w-full text-center overflow-hidden relative z-10">
            <span className="block text-[8px] md:text-[9px] lg:text-[10px] font-medium leading-tight truncate text-white/70 group-hover:text-white transition-colors">
                {element.name}
            </span>
        </div>
    </motion.div>
  );
};
