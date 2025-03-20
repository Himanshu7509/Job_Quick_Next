'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <p className="text-2xl font-medium text-gray-800 mt-4">
          Sorry, we couldn't find this page.
        </p>
        <p className="text-gray-500 mt-2">
          But don't worry, you can find plenty of other things on our homepage.
        </p>
        
        <div className="mt-8">
          <Link
          
            href="/"
            className="bg-teal-600 text-white px-6 py-3 rounded-md font-medium hover:bg-teal-700 transition"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}