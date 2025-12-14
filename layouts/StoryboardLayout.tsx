import React from 'react';
import { LucideIcon, BookOpen, Star, MapPin, MessageCircle } from 'lucide-react';

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

interface StoryboardLayoutProps {
  stages: Stage[];
  userName: string;
  onStageClick: (stage: Stage) => void;
}

/**
 * STORYBOARD LAYOUT - Comic Book / Story Panel Style
 * Features: Panel frames, speech bubbles, chapter pages, narrative flow
 */
export const StoryboardLayout: React.FC<StoryboardLayoutProps> = ({ stages, userName, onStageClick }) => {

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">

      {/* Book Cover */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative bg-gradient-to-br from-amber-800 via-amber-600 to-yellow-600 rounded-2xl p-12 shadow-2xl border-8 border-amber-900"
             style={{
               boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.1)'
             }}>

          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-300 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-300 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-300 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-300 rounded-br-lg"></div>

          {/* Book Spine Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-950 to-transparent opacity-40"></div>

          <div className="text-center relative z-10">
            <BookOpen size={64} className="text-yellow-200 mx-auto mb-6 drop-shadow-lg" />

            <h1 className="text-6xl md:text-7xl font-serif font-black text-yellow-100 mb-4 drop-shadow-2xl">
              The Tooth Fairy's
            </h1>
            <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-6 drop-shadow-2xl">
              Visit to {userName}
            </h2>

            <div className="w-32 h-1 bg-yellow-300 mx-auto mb-6 rounded-full"></div>

            <p className="text-xl text-yellow-100 font-serif italic max-w-2xl mx-auto">
              A magical journey through the night, filled with wonder and adventure
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Star className="text-yellow-300 fill-yellow-300 animate-pulse" size={24} />
              <span className="font-serif text-yellow-200 text-lg">A Fairy Tale in Progress</span>
              <Star className="text-yellow-300 fill-yellow-300 animate-pulse" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Story Chapters */}
      <div className="max-w-5xl mx-auto space-y-12">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isLocked = stage.type === 'locked';
          const isEven = index % 2 === 0;

          return (
            <div key={stage.id} className="relative">

              {/* Chapter Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
                <div className="bg-amber-600 text-white px-6 py-2 rounded-full font-serif font-bold text-lg shadow-lg border-2 border-amber-800">
                  Chapter {stage.id}
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
              </div>

              {/* Story Panel */}
              <div
                onClick={() => !isLocked && onStageClick(stage)}
                className={`
                  relative bg-white rounded-xl overflow-hidden shadow-xl border-4 border-amber-900
                  transition-all duration-500
                  ${isLocked ? 'opacity-60 cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-1'}
                `}
              >
                <div className={`grid md:grid-cols-2 ${isEven ? '' : 'md:grid-cols-[1fr_1.2fr]'} gap-0`}>

                  {/* Image Panel */}
                  <div className={`relative ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="relative h-80 md:h-full overflow-hidden">
                      <img
                        src={stage.cardImage}
                        alt={stage.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Comic Panel Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent"></div>

                      {/* Panel Border Lines */}
                      <div className="absolute inset-2 border-2 border-white/30 rounded-lg pointer-events-none"></div>

                      {/* Icon Badge */}
                      <div className="absolute top-4 left-4 w-16 h-16 bg-amber-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                        <Icon size={32} className="text-white" />
                      </div>

                      {/* Status Banner */}
                      <div className="absolute bottom-4 right-4">
                        <div className={`
                          px-4 py-2 rounded-lg font-bold text-sm shadow-lg border-2
                          ${stage.type === 'completed' ? 'bg-green-500 border-green-700 text-white' :
                            stage.type === 'active' ? 'bg-blue-500 border-blue-700 text-white animate-pulse' :
                            'bg-gray-400 border-gray-600 text-white'}
                        `}>
                          {stage.type === 'completed' ? '✓ Complete' :
                           stage.type === 'active' ? '▶ In Progress' :
                           '🔒 Locked'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Panel */}
                  <div className={`p-8 md:p-10 flex flex-col justify-center ${isEven ? 'md:order-2' : 'md:order-1'} bg-gradient-to-br from-amber-50 to-white`}>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-serif font-black text-amber-900 mb-4 leading-tight">
                      {stage.title}
                    </h3>

                    {/* Location Tag */}
                    <div className="flex items-center gap-2 text-amber-700 mb-6">
                      <MapPin size={18} />
                      <span className="font-serif italic text-lg">{stage.location}</span>
                    </div>

                    {/* Speech Bubble */}
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-900 mb-6">
                      {/* Bubble Tail */}
                      <div className="absolute -left-3 top-6 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-white border-b-[15px] border-b-transparent"></div>
                      <div className="absolute -left-[18px] top-6 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-amber-900 border-b-[15px] border-b-transparent"></div>

                      <div className="flex items-start gap-3 mb-3">
                        <MessageCircle size={20} className="text-purple-500 flex-shrink-0 mt-1" />
                        <p className="font-serif text-gray-800 leading-relaxed text-lg">
                          "{stage.message}"
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-serif italic text-purple-600 text-sm">- Kiki the Tooth Fairy</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-amber-200">
                      <div className="font-mono text-xs text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        {stage.subtext}
                      </div>

                      {!isLocked && (
                        <button className="text-amber-700 font-serif font-bold hover:text-amber-900 transition-colors flex items-center gap-2 group">
                          Read More
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Locked Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl border-4 border-amber-900 text-center">
                      <div className="text-6xl mb-3">🔒</div>
                      <div className="font-serif font-bold text-2xl text-gray-800 mb-2">Chapter Locked</div>
                      <div className="font-serif text-gray-600">Continue reading to unlock...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chapter Divider */}
              {index < stages.length - 1 && (
                <div className="flex items-center justify-center my-8">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full mx-3"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* The End */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-12 py-6 rounded-2xl shadow-2xl border-4 border-amber-900">
          <Star className="inline-block mb-2 fill-yellow-300 text-yellow-300" size={40} />
          <div className="font-serif text-3xl font-bold">To Be Continued...</div>
        </div>
      </div>
    </div>
  );
};
