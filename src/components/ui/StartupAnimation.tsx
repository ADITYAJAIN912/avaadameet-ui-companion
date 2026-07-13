import { useEffect, useState } from 'react';
import { Logo } from './Logo';

export function StartupAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Play the logo pulse, then start fading the whole screen out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1400);

    // Remove entirely from DOM after transition finishes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--surface-canvas)] transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center animate-brand-reveal">
        {/* Elegant Logo */}
        <Logo size="xl" withText className="drop-shadow-sm" />
      </div>

      <style>{`
        @keyframes brand-reveal {
          0% { transform: scale(0.9); opacity: 0; }
          15% { transform: scale(1); opacity: 1; }
          75% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .animate-brand-reveal {
          animation: brand-reveal 1.5s cubic-bezier(0.2, 0, 0, 1) forwards;
        }
      `}</style>
    </div>
  );
}
