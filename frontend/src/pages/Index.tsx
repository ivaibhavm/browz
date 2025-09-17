import React, { useState, useCallback } from 'react';
import NightSky from '@/components/NightSky';
import PromptInput from '@/components/PromptInput';
import { Navbar } from '@/components/Navbar';
import Disclaimer from '@/components/Disclaimer';

const Index: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const handleFinish = useCallback(() => setShowDisclaimer(false), []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <NightSky density="high" className="fixed inset-0 w-full h-full">
        <Navbar />
        <div className="min-h-screen w-full flex flex-col items-center justify-center animate-page-transition-in">
          <PromptInput className="z-10" />
        </div>
      </NightSky>
      {showDisclaimer ? <Disclaimer onFinish={handleFinish} /> : null}
    </div>
  );
};

export default Index;