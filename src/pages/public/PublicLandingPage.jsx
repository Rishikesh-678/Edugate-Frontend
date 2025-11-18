import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CourseCarousel from '../../components/common/CourseCarousel.jsx';
import { getLiveCourses } from '../../services/apiService.js';

export default function PublicLandingPage() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || null);

  useEffect(() => {
    // Update search query and category when location state changes (from header search)
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  useEffect(() => {
    // Fetch courses on component mount
    setLoading(true);
    setError('');
    getLiveCourses()
      .then((response) => {
        setCourses(response.data || response || []);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('selectedCategory changed:', selectedCategory);
  }, [selectedCategory]);

  // Filter courses based on search query and category
  useEffect(() => {
    let filtered = courses;

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.courseName?.toLowerCase().includes(query) ||
          course.instructor?.toLowerCase().includes(query) ||
          course.category?.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory]);

  // Get unique categories
  const getCategories = () => {
    const categoryMap = {};
    courses.forEach((course) => {
      if (course.category && !categoryMap[course.category]) {
        categoryMap[course.category] = [];
      }
      if (course.category) {
        categoryMap[course.category].push(course);
      }
    });
    return categoryMap;
  };

  const categories = getCategories();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section with Background Image */}
      <div className="mb-16 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat relative h-80 bg-gradient-to-r from-primary to-orange-400" style={{backgroundImage: 'url("/banners/public-landing-banner.jpg")'}}>
        <div className="relative z-10 flex flex-col items-center justify-between h-full p-8 md:flex-row md:p-12">
          <h1 className="mb-4 text-4xl font-bold text-white md:mb-0">
            Learning that
            <br />
            gets you...
          </h1>
        </div>
      </div>

      {/* About Us Section */}
      <div className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex justify-center">
          <img
            src="/images/about-us.jpg"
            alt="About Us"
            className="h-auto w-full max-w-xs opacity-90"
          />
        </div>
        <div>
          <h2 className="mb-4 text-3xl font-bold">About Us</h2>
          <p className="text-gray-700">
            At EduGate, we believe quality education should be accessible to
            everyone. Our platform connects learners with expert instructors,
            offering engaging courses across technology, business, creativity,
            and more. Whether you're upskilling for a career or exploring a new
            passion, EduGate is your gateway to knowledge and growth.
          </p>
        </div>
      </div>

      {/* Search Results or Featured Courses */}
      {searchQuery || selectedCategory ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              {selectedCategory && (
                <h2 className="text-3xl font-bold">{selectedCategory} Courses</h2>
              )}
              {searchQuery && !selectedCategory && (
                <>
                  <h2 className="text-3xl font-bold">Search Results</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                </>
              )}
              {searchQuery && selectedCategory && (
                <>
                  <h2 className="text-3xl font-bold">Search in {selectedCategory}</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                >
                  Back to Categories
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
          {error && (
            <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {loading ? (
            <div className="py-8 text-center text-gray-600">Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              {selectedCategory && searchQuery
                ? `No courses found in ${selectedCategory} matching your search.`
                : selectedCategory
                ? `No courses found in ${selectedCategory}.`
                : 'No courses found matching your search.'}
            </div>
          ) : (
            <CourseCarousel courses={filteredCourses} />
          )}
        </div>
      ) : (
        <>
          {/* Categories with Thumbnails Section */}
          <div>
            <h2 className="mb-8 text-3xl font-bold">Explore by Category</h2>
            {error && (
              <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {loading ? (
              <div className="py-8 text-center text-gray-600">Loading categories...</div>
            ) : Object.keys(categories).length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                No categories available.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(categories).slice(0, 4).map(([category, catCourses]) => {
                  const firstCourse = catCourses[0]; // Get first course for thumbnail
                  return (
                    <div 
                      key={category} 
                      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => {
                        console.log('Clicking category:', category);
                        setSelectedCategory(category);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSelectedCategory(category);
                        }
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden bg-gray-200 aspect-video pointer-events-none">
                        <img
                          src={firstCourse?.thumbnailUrl || 'https://placehold.co/400x300/F9A826/4A4A4A?text=' + category}
                          alt={category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            (e.target.src =
                              'https://placehold.co/400x300/F9A826/4A4A4A?text=' + category)
                          }
                        />
                        {/* Overlay with category name */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                          <h3 className="text-2xl font-bold text-white text-center px-4">{category}</h3>
                        </div>
                      </div>
                      
                      {/* Category Info */}
                      <div className="p-4 pointer-events-none">
                        <p className="text-sm text-gray-600 mb-3">
                          {catCourses.length} course{catCourses.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-primary font-medium">
                          Browse {category} →
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}