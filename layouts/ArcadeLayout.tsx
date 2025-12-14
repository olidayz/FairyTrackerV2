import React, { useState, useEffect } from 'react';
import { LucideIcon, Star, Zap, Trophy, Lock } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  type: 'active' | 'locked' | 'completed';
  icon: LucideIcon;
  message: string;
  subtext: string;
  location: string;
  cardImage: string;
}

interface ArcadeLayoutProps {
  stages: Stage[];
  userName: string;
  onStageClick: (stage: Stage) => void;
}

/**
 * ARCADE/RETRO LAYOUT - 80s/90s Game Aesthetic
 * Features: Pixel borders, neon colors, score counter, CRT effect
 */
export const ArcadeLayout: React.FC<ArcadeLayoutProps> = ({ stages, userName, onStageClick }) => {
  const [score, setScore] = useState(0);
  const [lives] = useState(3);

  useEffect(() => {
    const completedCount = stages.filter(s => s.type === 'completed').length;
    setScore(completedCount * 1000);
  }, [stages]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* CRT Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.3) 2px, rgba(0,255,0,0.3) 4px)'
        }} />
      </div>

      {/* Starfield Background */}
      <div className="fixed inset-0 opacity-40">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-8">

        {/* Arcade Header */}
        <div className="max-w-7xl mx-auto mb-12">

          {/* Score Bar */}
          <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 border-4 border-yellow-400 rounded-lg p-4 mb-8 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono">

              {/* Score */}
              <div className="flex items-center gap-4">
                <span className="text-yellow-400 text-sm tracking-widest">SCORE</span>
                <span className="text-4xl font-black text-white tracking-wider" style={{ textShadow: '0 0 10px #fff, 0 0 20px #0ff, 0 0 30px #0ff' }}>
                  {score.toString().padStart(6, '0')}
                </span>
              </div>

              {/* Lives */}
              <div className="flex items-center gap-3">
                <span className="text-pink-400 text-sm tracking-widest">LIVES</span>
                <div className="flex gap-2">
                  {[...Array(lives)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-pink-500 rotate-45 shadow-[0_0_10px_#ec4899]"></div>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 text-sm tracking-widest">LEVEL</span>
                <span className="text-3xl font-black text-cyan-300" style={{ textShadow: '0 0 10px #0ff' }}>
                  {stages.filter(s => s.type === 'active').length || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Title Screen */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-[200px] font-black text-yellow-400">★</div>
            </div>

            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter"
                  style={{
                    color: '#ff00ff',
                    textShadow: '4px 4px 0px #00ffff, -2px -2px 0px #ffff00, 0 0 20px #ff00ff'
                  }}>
                {userName.toUpperCase()}'S
              </h1>
              <h2 className="text-4xl md:text-6xl font-black"
                  style={{
                    color: '#00ff00',
                    textShadow: '3px 3px 0px #ff00ff, 0 0 15px #00ff00'
                  }}>
                TOOTH QUEST
              </h2>

              <div className="mt-6 inline-block animate-bounce">
                <div className="bg-yellow-400 text-black px-8 py-3 font-black text-xl tracking-wider border-4 border-black shadow-[4px_4px_0px_#000]">
                  PRESS START
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isLocked = stage.type === 'locked';
            const isCompleted = stage.type === 'completed';
            const isActive = stage.type === 'active';

            let borderColor = 'border-gray-600';
            let bgGlow = 'rgba(100,100,100,0.3)';

            if (isCompleted) {
              borderColor = 'border-green-400';
              bgGlow = 'rgba(34,197,94,0.3)';
            } else if (isActive) {
              borderColor = 'border-yellow-400 animate-pulse';
              bgGlow = 'rgba(250,204,21,0.3)';
            }

            return (
              <div
                key={stage.id}
                onClick={() => !isLocked && onStageClick(stage)}
                className={`
                  relative group
                  ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                  transition-all duration-300
                `}
                style={{
                  filter: isLocked ? 'grayscale(1)' : 'none'
                }}
              >
                {/* Pixel Border Container */}
                <div className={`border-4 ${borderColor} bg-black rounded-lg overflow-hidden`}
                     style={{ boxShadow: `0 0 20px ${bgGlow}` }}>

                  {/* Level Number Banner */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 flex items-center justify-between border-b-4 border-black">
                    <span className="font-black text-white text-lg tracking-wider">LEVEL {stage.id}</span>

                    {isCompleted && (
                      <div className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full font-black text-xs">
                        <Trophy size={14} />
                        CLEAR!
                      </div>
                    )}

                    {isActive && (
                      <div className="flex items-center gap-1 bg-green-400 text-black px-3 py-1 rounded-full font-black text-xs animate-pulse">
                        <Zap size={14} />
                        ACTIVE
                      </div>
                    )}

                    {isLocked && (
                      <Lock size={20} className="text-gray-400" />
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative h-40 overflow-hidden border-b-4 border-black">
                    <img
                      src={stage.cardImage}
                      alt={stage.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: isLocked ? 'grayscale(1) brightness(0.5)' : 'brightness(0.9) contrast(1.1)'
                      }}
                    />

                    {/* Pixelated Icon Overlay */}
                    <div className="absolute top-2 right-2 w-12 h-12 bg-black/80 border-2 border-cyan-400 flex items-center justify-center">
                      <Icon size={24} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px #00ffff)' }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-gradient-to-b from-gray-900 to-black">
                    <h3 className="font-black text-xl mb-2 tracking-tight"
                        style={{
                          color: isActive ? '#ffff00' : isCompleted ? '#00ff00' : '#ffffff',
                          textShadow: `0 0 10px ${isActive ? '#ffff00' : isCompleted ? '#00ff00' : '#ffffff'}`
                        }}>
                      {stage.title}
                    </h3>

                    <p className="text-sm text-gray-300 mb-3 leading-relaxed font-mono">
                      {stage.message}
                    </p>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-between text-xs font-mono pt-3 border-t-2 border-gray-800">
                      <span className="text-cyan-400">{stage.location}</span>
                      <span className="text-pink-400">{stage.subtext}</span>
                    </div>

                    {/* XP Bar */}
                    {!isLocked && (
                      <div className="mt-3 h-2 bg-gray-800 border border-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isCompleted ? 'bg-green-400 w-full' : isActive ? 'bg-yellow-400 w-1/2 animate-pulse' : 'bg-gray-600 w-0'}`}
                          style={{ boxShadow: '0 0 10px currentColor' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center">
                        <Lock size={48} className="text-gray-600 mx-auto mb-2" />
                        <div className="bg-red-600 text-white px-4 py-2 font-black text-sm border-2 border-white">
                          LOCKED
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Stars for Completed */}
                {isCompleted && (
                  <div className="absolute -top-4 -right-4 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-yellow-400 animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Banner */}
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-4 border-yellow-400 px-8 py-4 rounded-lg font-black text-white text-xl tracking-widest"
               style={{ textShadow: '2px 2px 0px #000' }}>
            INSERT COIN TO CONTINUE
          </div>
        </div>
      </div>
    </div>
  );
};
