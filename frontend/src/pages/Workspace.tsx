import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NightSky from '@/components/NightSky';
import WorkspaceLayout from '@/components/WorkspaceLayout';

const Workspace: React.FC = () => {
  const location = useLocation()
  const prompt = location.state?.prompt
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!prompt) {
      navigate('/');
      return;
    }
    
    // Simulate loading
    // const timer = setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);
    
    // return () => clearTimeout(timer);

    setIsLoading(false);

  }, [navigate, prompt]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <NightSky className="fixed inset-0">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-400">Building your website...</p>
          </div>
        </NightSky>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex items-stretch">
      <NightSky className="fixed inset-0" density="low" />
      <div className="relative z-10 w-full animate-page-transition-in">
        <WorkspaceLayout />
      </div>
    </div>
  );
};

export default Workspace;
