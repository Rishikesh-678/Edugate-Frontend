import React, { useRef, useState, useEffect } from 'react';
import CourseCard from './CourseCard';

export default function CourseCarousel({ courses, linkPrefix = '/course', renderButton = null }) {
  const scrollContainer = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainer.current;
    if (container) {
      const scrollAmount = 300; // Adjust based on card width + gap
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Left Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:block absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-lg p-2 hover:bg-gray-100 transition-colors"
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable Container - Responsive width for mobile */}
      <div
        ref={scrollContainer}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-2 mx-0 sm:mx-10"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d1d5db #f3f4f6',
        }}
      >
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="flex-shrink-0" 
            style={{ 
              width: isMobile ? 'calc(100vw - 32px)' : 'calc(20% - 18px)',
              minWidth: isMobile ? '280px' : 'auto'
            }}
          >
            <CourseCard
              course={course}
              linkTo={`${linkPrefix}/${course.id}`}
            >
              {renderButton && renderButton(course)}
            </CourseCard>
          </div>
        ))}
      </div>

      {/* Right Arrow - Hidden on mobile */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:block absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-lg p-2 hover:bg-gray-100 transition-colors"
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Custom scrollbar styles */}
      <style>{`
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
