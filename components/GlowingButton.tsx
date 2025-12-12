import React from 'react';
import { StageButtonProps } from '../types';
import { Lock } from 'lucide-react';

const colorStyles = {
  yellow: {
    base: 'bg-toy-yellow',
    glow: 'text-toy-yellow shadow-[0_0_25px_rgba(250,204,21,0.6)]',
    text: 'text-yellow-900', // Dark text for contrast on yellow
  },
  magenta: {
    base: 'bg-toy-magenta',
    glow: 'text-toy-magenta shadow-[0_0_25px_rgba(232,121,249,0.6)]',
    text: 'text-white',
  },
  cyan: {
    base: 'bg-toy-cyan',
    glow: 'text-toy-cyan shadow-[0_0_25px_rgba(34,211,238,0.6)]',
    text: 'text-cyan-950',
  },
  white: {
    base: 'bg-toy-white',
    glow: 'text-toy-white shadow-[0_0_25px_rgba(255,255,255,0.5)]',
    text: 'text-slate-600',
  },
};

export const GlowingButton: React.FC<StageButtonProps> = ({ 
  icon: Icon, 
  isActive, 
  isLocked, 
  color,
  onClick 
}) => {
  const styles = colorStyles[color];

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className={`
        relative w-[58px] h-[58px] rounded-2xl
        flex items-center justify-center
        transition-all duration-200
        group
        ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
      `}
      style={{
        backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : styles.base,
        // If active, it glows from outside ring. If inactive, it's a solid jelly button.
        boxShadow: isActive 
          ? `0 0 15px ${styles.base}, inset 0 0 15px ${styles.base}` 
          : `inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3)`,
        border: isActive ? `2px solid ${styles.base}` : 'none',
        transform: isActive ? 'translateY(2px)' : 'translateY(0)',
      }}
    >
      {/* Glossy highlight bubble for jelly effect */}
      {!isActive && (
        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-white opacity-40 rounded-full blur-[0.5px]" />
      )}
      
      {/* The Icon */}
      <div className={`
        relative z-10 transition-all duration-300
        ${isActive ? styles.glow : styles.text}
      `}>
        {isLocked ? (
          <Lock className="w-6 h-6 opacity-80" />
        ) : (
          <Icon className={`w-8 h-8 stroke-[2.5] ${!isActive && 'drop-shadow-sm'}`} />
        )}
      </div>

      {/* Active Inner Light */}
      {isActive && (
         <div 
           className="absolute inset-0 rounded-xl blur-md opacity-40"
           style={{ backgroundColor: styles.base }} 
         />
      )}
    </button>
  );
};