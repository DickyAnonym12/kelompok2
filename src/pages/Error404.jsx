import React from 'react';
import error404Img from '../assets/errors/404.png'; // Adjust path according to your project structure
import { useNavigate } from 'react-router-dom';

const Error400 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <img src={error404Img} alt="404 Not Found" className="max-w-full sm:max-w-5xl mb-4 sm:mb-6" />
      <button
        onClick={() => navigate('/')}
        className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Error400;