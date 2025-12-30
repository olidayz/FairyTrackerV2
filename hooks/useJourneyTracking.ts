import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackScrollDepth, initJourney } from '../lib/journeyTracking';

export function useJourneyTracking() {
  const location = useLocation();
  const scrollRef = useRef<number>(0);
  
  useEffect(() => {
    initJourney();
  }, []);
  
  useEffect(() => {
    const title = document.title || location.pathname;
    trackPageView(location.pathname, title);
    
    scrollRef.current = 0;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      if (scrollPercent > scrollRef.current + 10) {
        scrollRef.current = scrollPercent;
        trackScrollDepth(scrollPercent);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);
}
