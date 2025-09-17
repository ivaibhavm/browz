import React, { useEffect } from 'react';

interface DisclaimerProps {
  onFinish: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="relative z-10 bg-gray-800/90 text-white rounded-lg shadow-xl px-6 py-5 max-w-md w-[90%] text-center border border-white/10">
        <h2 className="text-lg font-semibold mb-2">Work in Progress</h2>
        <p className="text-sm text-gray-300">
          This project is still a work in progress.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
