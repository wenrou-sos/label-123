import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed right-6 z-40 w-12 h-12 rounded-full',
        'bg-gradient-to-br from-rose-500 to-rose-600 text-white',
        'shadow-soft hover:shadow-lg',
        'flex items-center justify-center',
        'hover:scale-110 active:scale-95 transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
      style={{ bottom: '6rem' }}
      aria-label="回到顶部"
    >
      <ArrowUp size={20} strokeWidth={2.2} />
    </button>
  );
};
