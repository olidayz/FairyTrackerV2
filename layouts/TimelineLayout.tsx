import React from 'react';
import { LucideIcon, CheckCircle2, Clock, Lock, Star } from 'lucide-react';

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

interface TimelineLayoutProps {
  stages: Stage[];
  userName: string;
  onStageClick: (stage: Stage) => void;
}

/**
 * TIMELINE LAYOUT - Vertical Journey Progression
 * Features: Connected dots, side-by-side cards, progress path
 */
export const TimelineLayout: React.FC<TimelineLayoutProps> = ({ stages, userName, onStageClick }) => {

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'completed': return 'from-green-400 to-emerald-500';
      case 'active': return 'from-blue-400 to-cyan-500';
      case 'locked': return 'from-slate-300 to-slate-400';
      default: return 'from-slate-300 to-slate-400';
    }
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'completed': return 'bg-gradient-to-b from-emerald-500 to-blue-500';
      case 'active': return 'bg-gradient-to-b from-blue-500 to-slate-300';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-5 py-2 rounded-full mb-6">
          <Star size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-slate-300 tracking-wider">FAIRY MISSION LOG</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
          {userName}'s<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Night Adventure
          </span>
        </h1>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
            <span className="text-sm text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"></div>
            <span className="text-sm text-slate-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-sm text-slate-400">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto relative">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isEven = index % 2 === 0;
          const isLast = index === stages.length - 1;
          const isLocked = stage.type === 'locked';

          return (
            <div key={stage.id} className="relative">

              {/* Timeline Connector Line */}
              {!isLast && (
                <div className={`absolute left-1/2 top-32 w-1 h-full -translate-x-1/2 ${getLineColor(stages[index + 1].type)}`}
                     style={{ height: 'calc(100% + 4rem)' }}
                />
              )}

              {/* Timeline Item */}
              <div className={`relative flex items-center mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Card - Left or Right */}
                <div
                  onClick={() => !isLocked && onStageClick(stage)}
                  className={`
                    w-[calc(50%-4rem)] group cursor-pointer
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={stage.cardImage}
                        alt={stage.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                      {/* Step Number Badge */}
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur border border-slate-600 flex items-center justify-center">
                        <span className="text-white font-bold">{stage.id}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getStatusColor(stage.type)} flex items-center justify-center`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {stage.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {stage.message}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-mono">{stage.location}</span>
                        <span className="text-slate-600 font-mono">{stage.subtext}</span>
                      </div>
                    </div>

                    {isLocked && (
                      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                        <Lock size={32} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Timeline Dot */}
                <div className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getStatusColor(stage.type)} shadow-xl`}>
                    {stage.type === 'completed' && (
                      <CheckCircle2 size={24} className="text-white" />
                    )}
                    {stage.type === 'active' && (
                      <div className="w-full h-full rounded-full animate-ping bg-blue-400 opacity-75"></div>
                    )}
                  </div>
                  {/* Pulse ring for active */}
                  {stage.type === 'active' && (
                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                  )}
                </div>

                {/* Time Label - Opposite Side */}
                <div className={`w-[calc(50%-4rem)] flex ${isEven ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur border border-slate-700 px-4 py-2 rounded-full">
                    <Clock size={14} className="text-slate-500" />
                    <span className="text-xs font-mono text-slate-400">{stage.subtext}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
