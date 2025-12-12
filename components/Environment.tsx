import React from 'react';
import { StarProps } from '../types';

const GlowStar: React.FC<StarProps> = ({ top, left, size, delay }) => (
  <div
    className="absolute animate-twinkle text-yellow-100"
    style={{
      top,
      left,
      width: `${size * 3}px`,
      height: `${size * 3}px`,
      animationDelay: delay,
      filter: 'drop-shadow(0 0 5px rgba(255, 255, 200, 0.3))',
      opacity: 0.6
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </div>
);

export const Environment: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-toy-midnight">
      {/* 
          Background Texture
          Subtle grid to suggest a "holodeck" or tech environment
      */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', 
            backgroundSize: '50px 50px' 
        }} 
      />
      
      {/* Floating Pale Stars */}
      <GlowStar top="15%" left="15%" size={6} delay="0s" />
      <GlowStar top="25%" left="80%" size={4} delay="2s" />
      <GlowStar top="70%" left="12%" size={5} delay="1s" />
      <GlowStar top="85%" left="70%" size={3} delay="3s" />
      <GlowStar top="35%" left="90%" size={4} delay="1.5s" />
      <GlowStar top="10%" left="50%" size={3} delay="4s" />

      {/* Blue Planet/Moon in background */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[80px] opacity-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-900 rounded-full blur-[60px] opacity-20" />
    </div>
  );
};