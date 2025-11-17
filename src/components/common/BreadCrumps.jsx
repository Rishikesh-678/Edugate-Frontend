import React from 'react';
import { Link } from 'react-router-dom';

// Simple right-arrow icon as an SVG
const ChevronRightIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Renders breadcrumb navigation.
 * @param {object} props
 * @param {Array<{name: string, path?: string}>} props.crumbs - Array of crumb objects. If path is missing, it's treated as the current page.
 */
export default function Breadcrumbs({ crumbs = [] }) {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {crumbs.map((crumb, index) => (
          <li key={index}>
            <div className="flex items-center">
              {/* Add separator (icon) before all items except the first one */}
              {index > 0 && <ChevronRightIcon />}

              {/* Check if it's the last crumb (or if path is not provided) */}
              {index === crumbs.length - 1 || !crumb.path ? (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}