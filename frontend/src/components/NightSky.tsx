import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface NightSkyProps {
  className?: string;
  density?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

const NightSky: React.FC<NightSkyProps> = ({ 
  className, 
  density = 'medium',
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Remove existing stars
    const existingStars = container.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());
    
    // Determine star count based on density
    const densityMap = {
      low: 100,
      medium: 200,
      high: 350
    };
    
    const starCount = densityMap[density];
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      const size = Math.random();
      const delay = Math.random() * 5;
      
      // Set star properties
      star.classList.add('star');
      
      if (size < 0.6) {
        star.classList.add('star-small', 'animate-twinkle-slow');
      } else if (size < 0.9) {
        star.classList.add('star-medium', 'animate-twinkle');
      } else {
        star.classList.add('star-large', 'animate-twinkle-fast');
      }
      
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.animationDelay = `${delay}s`;
      
      container.appendChild(star);
    }
    
    // Add parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / containerWidth) - 0.5;
      const yPos = (e.clientY / containerHeight) - 0.5;
      
      const stars = container.querySelectorAll('.star');
      stars.forEach((star, index) => {
        const el = star as HTMLElement;
        const speed = index % 3 === 0 ? 2 : index % 2 === 0 ? 1 : 0.5;
        
        const x = parseFloat(el.style.left.replace('px', ''));
        const y = parseFloat(el.style.top.replace('px', ''));
        
        el.style.transform = `translate(${xPos * speed * 5}px, ${yPos * speed * 5}px)`;
      });
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [density]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-gradient-to-b from-night-darker via-night to-night-lighter",
        className
      )}
    >
      {/* Subtle glow effects */}
      <div className="absolute top-[20%] left-[15%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      
      {/* Children content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default NightSky;
