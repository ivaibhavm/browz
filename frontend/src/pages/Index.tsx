import React from 'react';
import NightSky from '@/components/NightSky';
import PromptInput from '@/components/PromptInput';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <NightSky density="high" className="fixed inset-0 w-full h-full">
        <div className="min-h-screen w-full flex flex-col items-center justify-center animate-page-transition-in">
          <PromptInput className="z-10" />
        </div>
      </NightSky>
    </div>
  );
};

export default Index;