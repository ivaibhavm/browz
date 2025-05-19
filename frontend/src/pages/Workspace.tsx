import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NightSky from '@/components/NightSky';
import WorkspaceLayout from '@/components/WorkspaceLayout';

const Workspace: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get prompt from session storage
    const storedPrompt = sessionStorage.getItem('prompt');
    if (!storedPrompt) {
      navigate('/');
      return;
    }
    
    setPrompt(storedPrompt);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
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
        <WorkspaceLayout prompt={prompt} />
      </div>
    </div>
  );
};

export default Workspace;
