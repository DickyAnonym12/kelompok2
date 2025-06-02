import React from 'react';
import error403Img from '../assets/errors/403.png'; // Adjust path according to your project structure
import { useNavigate } from 'react-router-dom';

const Error400 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <img src={error403Img} alt="400 Bad Request" className="max-w-5xl mb-6" />
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Error400;