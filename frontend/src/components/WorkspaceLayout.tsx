import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import StepsList from './StepsList';
import CodePreview from './CodePreview';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { parseSteps } from '@/parseSteps';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ArrowRight } from 'lucide-react';


const initialSteps = [];

const mockCode = ``

const WorkspaceLayout = () => {
  const location = useLocation()
  const prompt = location.state?.prompt
  const [steps, setSteps] = useState(initialSteps);
  const [selectedFileId, setSelectedFileId] = useState<string>('App.jsx');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  async function init() {
    // const templateResponse = await axios.post(`${BACKEND_URL}/api/template`, {
    //   prompt: prompt
    // });

    // setSteps(parseSteps(templateResponse.data.uiPrompts))

    // const messages = templateResponse.data.prompts;
    // const chatMessages = [
    //   { role: 'user', content: messages[0] },
    //   { role: 'user', content: messages[1] }
    // ];
    // const chatResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
    //   messages: chatMessages
    // });
    // const chat = chatResponse.data;
    // console.log(chat);
  }
  useEffect(() => {
    init();
  }, []);
  
  
  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };
  
  const handlePublish = () => {
    setShowPublishPopup(true);
  }
  const handleClosePopup = () => {
    setShowPublishPopup(false);
  }

  const handleSubmit = () => {

  }
  
  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const nextIncompleteStep = prevSteps.find(step => !step.completed);
        if (!nextIncompleteStep) {
          clearInterval(interval);
          return prevSteps;
        }
        
        return prevSteps.map(step => 
          step.id === nextIncompleteStep.id ? { ...step, completed: true } : step
        );
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={cn("h-full flex flex-col")}>
      {/* Header */}
      <header className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src='logo.png' height={40} width={40}></img>
          </Link>
          <h1 className="text-xl font-medium text-white truncate max-w-md">
            Workspace
          </h1>
          <Button className='bg-white text-black hover:bg-slate-100' onClick={handlePublish}>Publish</Button>
        </div>
      </header>

      {/* Publish Popup Overlay */}
      {showPublishPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClosePopup}>
          <Card className="glass-effect max-w-md w-full mx-4 relative bg-white/10 border-none shadow-none flex items-center justify-center min-h-[180px]" onClick={e => e.stopPropagation()}>
            <span className="text-white text-xl font-semibold text-center w-full">Available soon...</span>
          </Card>
        </div>
      ) : null}
      
      <div className="flex-grow grid grid-cols-1 m-4 gap-4 md:grid-cols-[400px_1fr] xl:grid-cols-[400px_1fr] h-full">
        
        <div className="workspace-column rounded-lg h-full flex flex-col overflow-hidden backdrop-blur-sm border border-[#333] bg-[#101010]">
          <StepsList 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
            className="flex-1 min-h-0 max-h-[70vh] overflow-y-auto custom-scrollbar"
          />
          <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef as any}
            style={{ height: '120px', width: '100%', resize: 'none' }}
            autoFocus
            className="bg-[#191919] p-3 pr-14 w-full text-white align-top custom-scrollbar focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
            rows={5}
          />
          {prompt.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/4 -translate-y-1/2 transition-all duration-300"
              onClick={handleSubmit}
            >
              <ArrowRight className="transition-transform duration-300" />
            </Button>
          ) : null }
        </form>
        </div>
        
        <div className="workspace-column rounded-lg backdrop-blur-sm  border border-[#333] bg-[#101010] flex-grow">
          <CodePreview 
            fileId={selectedFileId} 
            code={mockCode} 
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
