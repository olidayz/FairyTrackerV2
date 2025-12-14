import React, { useState } from 'react';
import { LucideIcon, CheckCircle2, Lock, Circle, Sparkles, MapPin } from 'lucide-react';

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

interface CardGridLayoutProps {
  stages: Stage[];
  userName: string;
  onStageClick: (stage: Stage) => void;
}

/**
 * CARD GRID LAYOUT - Modern, Clean, Minimal
 * Features: Simple card grid, soft shadows, pastel gradients, breathing animations
 */
export const CardGridLayout: React.FC<CardGridLayoutProps> = ({ stages, userName, onStageClick }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'active': return <Circle size={20} className="text-blue-500 animate-pulse" fill="currentColor" />;
      case 'locked': return <Lock size={20} className="text-slate-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-6 py-2 rounded-full shadow-sm mb-4">
          <Sparkles size={16} className="text-purple-500" />
          <span className="text-sm font-medium text-purple-600">Tooth Fairy Tracker</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
          {userName}'s Journey
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Follow along as your tooth fairy travels through the night
        </p>
      </div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isHovered = hoveredId === stage.id;
          const isLocked = stage.type === 'locked';

          return (
            <div
              key={stage.id}
              onClick={() => !isLocked && onStageClick(stage)}
              onMouseEnter={() => setHoveredId(stage.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                group relative bg-white rounded-3xl overflow-hidden shadow-lg
                transition-all duration-500 ease-out
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'}
                ${isHovered && !isLocked ? 'scale-105' : 'scale-100'}
              `}
              style={{
                animation: `float ${3 + index * 0.3}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={stage.cardImage}
                  alt={stage.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isHovered && !isLocked ? 'scale-110' : 'scale-100'
                  }`}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  {getStatusIcon(stage.type)}
                  <span className="text-xs font-semibold capitalize text-slate-700">
                    {stage.type}
                  </span>
                </div>

                {/* Step Number */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {stage.id}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Icon & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
                      {stage.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={14} />
                      <span>{stage.location}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-slate-600 leading-relaxed text-sm">
                  {stage.message}
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400">{stage.subtext}</span>

                  {!isLocked && (
                    <div className="text-purple-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      View Details →
                    </div>
                  )}
                </div>
              </div>

              {/* Locked Overlay */}
              {isLocked && (
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
                    <Lock size={24} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">Coming Soon</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Float Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
