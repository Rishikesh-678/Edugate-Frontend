import React from 'react';
import CourseCard from '../../components/common/CourseCard.jsx';

// Mock data, this will come from your API
const mockCourses = [
  { id: 1, courseName: 'AI', thumbnailUrl: null, placeholderImg: 'AI' },
  {
    id: 2,
    courseName: 'Machine Learning',
    thumbnailUrl: null,
    placeholderImg: 'ML',
  },
];

export default function PublicLandingPage() {
  // In a real app, you'd use:
  // const [courses, setCourses] = useState([]);
  // useEffect(() => {
  //   getLiveCourses().then(response => setCourses(response.data));
  // }, []);
  // For now, we use mocks.

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-orange-400">
        <div className="flex flex-col items-center justify-between p-8 md:flex-row md:p-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-800 md:mb-0">
            Learning that
            <br />
            gets you...
          </h1>
          <img
            src="https://placehold.co/300x300/FFFFFF/4A4A4A?text=Instructor"
            alt="Instructor"
            className="h-48 w-48 rounded-full object-cover md:h-64 md:w-64"
          />
        </div>
      </div>

      {/* About Us Section */}
      <div className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <img
          src="https://placehold.co/400x300/EEEEEE/4A4A4A?text=Books+Icon"
          alt="About Us"
          className="h-auto w-full max-w-sm rounded-lg"
        />
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

      {/* Essential Skills Section */}
      <div>
        <h2 className="mb-8 text-3xl font-bold">
          Learn Essential Skills...
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              linkTo={`/course/${course.id}`} // This will go to CourseDetailPage
              placeholderImg={course.placeholderImg}
            />
          ))}
          {/* Add more placeholders as needed */}
        </div>
      </div>
    </div>
  );
}