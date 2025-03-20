import React from 'react';

const Loader = () => {
  return (
    <div className="w-full h-2 bg-gray-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-800 via-teal-500 to-teal-300 rounded-full shadow-md animate-slide"></div>

      <style>
        {`
          @keyframes slide {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }

          .animate-slide {
            animation: slide 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;