import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-100">
      <div className="container mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            Contact US
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Edugate@gmail.com</li>
            <li>9876543210</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            About US
          </h3>
          <p className="max-w-xs text-sm text-gray-700">
            At EduGate, we believe quality education should be accessible to
            everyone. Our platform connects learners with expert instructors.
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-primary">EduGate</h2>
        </div>
      </div>
    </footer>
  );
}