import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 leading-none">
              404
            </div>
            <Sparkles className="absolute top-4 right-1/4 w-8 h-8 text-amber-400 animate-pulse" />
            <Sparkles className="absolute bottom-8 left-1/4 w-6 h-6 text-cyan-400 animate-pulse delay-300" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Oops! This page flew away
          </h1>
          
          <p className="text-slate-400 text-lg mb-8">
            Looks like Kiki couldn't find this page on her magical map. 
            It might have moved or doesn't exist anymore.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-fuchsia-400 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              <Home size={20} />
              Go Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800/50 transition-all duration-300"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;
