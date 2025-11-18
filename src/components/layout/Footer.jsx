import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-100">
      <div className="container mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-primary font-medium">Email:</span>
              <a href="mailto:Edugate@gmail.com" className="hover:text-primary hover:underline">
                Edugate@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary font-medium">Phone:</span>
              <a href="tel:9876543210" className="hover:text-primary hover:underline">
                +91 9876543210
              </a>
            </li>
          </ul>
        </div>

        {/* --- About Us section removed --- */}

        <div className="text-right">
          <h2 className="text-2xl font-bold text-primary">EduGate</h2>
        </div>
      </div>
    </footer>
  );
}