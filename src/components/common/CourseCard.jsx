import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A reusable card for displaying a course.
 * @param {object} props
 * @param {object} props.course - The course object
 * @param {string} props.linkTo - The URL to navigate to on click
 * @param {React.ReactNode} [props.children] - Optional buttons (e.g., Unsubscribe)
 */
export default function CourseCard({
  course,
  linkTo,
  children,
  placeholderImg,
}) {
  const defaultImg =
    'https://placehold.co/400x300/F9A826/4A4A4A?text=EduGate';
  const aifallback =
    'https://placehold.co/400x300/6B7280/FFFFFF?text=AI';
  const mlFallback =
    'https://placehold.co/400x300/3B82F6/FFFFFF?text=ML';
  
  const getFallback = () => {
    if (placeholderImg === 'AI') return aifallback;
    if (placeholderImg === 'ML') return mlFallback;
    return defaultImg;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary group cursor-pointer">
      <Link to={linkTo} className="block overflow-hidden">
        <img
          src={course.thumbnailUrl || getFallback()}
          alt={course.courseName}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.target.src = getFallback())}
        />
      </Link>
      <div className="p-4">
        <Link to={linkTo}>
          <h3 className="truncate font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary" title={course.courseName}>
            {course.courseName || 'Course Title'}
          </h3>
        </Link>
        {course.instructor && (
          <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{course.instructor}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}