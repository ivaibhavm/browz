import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StepsList from './StepsList';
import FileTree from './FileTree';
import CodePreview from './CodePreview';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { parseSteps } from '@/parseSteps';

interface WorkspaceLayoutProps {
  prompt: string;
  className?: string;
}
// Mock data
const initialSteps = [];

const initialFiles = [
  {
    id: 'root',
    name: 'project-root',
    type: 'folder' as const,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder' as const,
        children: [
          {
            id: 'components',
            name: 'components',
            type: 'folder' as const,
            children: [
              { id: 'Header.jsx', name: 'Header.jsx', type: 'file' as const },
              { id: 'Footer.jsx', name: 'Footer.jsx', type: 'file' as const }
            ]
          },
          {
            id: 'pages',
            name: 'pages',
            type: 'folder' as const,
            children: [
              { id: 'Home.jsx', name: 'Home.jsx', type: 'file' as const },
              { id: 'About.jsx', name: 'About.jsx', type: 'file' as const }
            ]
          },
          { id: 'App.jsx', name: 'App.jsx', type: 'file' as const },
          { id: 'index.js', name: 'index.js', type: 'file' as const }
        ]
      },
      { id: 'package.json', name: 'package.json', type: 'file' as const },
      { id: 'README.md', name: 'README.md', type: 'file' as const }
    ]
  }
];

// Mock code for demonstration
const mockCode = ``

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ prompt, className }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [files, setFiles] = useState(initialFiles);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFileId, setSelectedFileId] = useState<string>('App.jsx');
  
  // useEffect(() => {
  //   const templateResponse = axios.post(`${BACKEND_URL}/api/template`, {
  //     prompt: prompt
  //   });
  //   console.log(templateResponse);
  // }, [prompt]);
  
  
  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };
  
  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
  };
  
  // Simulate progress
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSteps(prevSteps => {
  //       const nextIncompleteStep = prevSteps.find(step => !step.completed);
  //       if (!nextIncompleteStep) {
  //         clearInterval(interval);
  //         return prevSteps;
  //       }
        
  //       return prevSteps.map(step => 
  //         step.id === nextIncompleteStep.id ? { ...step, completed: true } : step
  //       );
  //     });
  //   }, 5000);
    
  //   return () => clearInterval(interval);
  // }, []);
  
  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <header className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-zinc-400 hover:text-white mr-4 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-medium text-white truncate max-w-md">
            Building: <span className="text-primary">{prompt}</span>
          </h1>
        </div>
      </header>
      
      {/* Main content area - 3 columns */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr_1fr] xl:grid-cols-[300px_350px_1fr] h-full">
        {/* Column 1: Steps */}
        <div className="workspace-column overflow-y-auto bg-night-darker">
          <StepsList 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
          />
        </div>
        
        {/* Column 2: Files */}
        <div className="workspace-column overflow-y-auto bg-night md:block">
          <FileTree 
            files={files} 
            onFileSelect={handleFileSelect} 
            selectedFileId={selectedFileId} 
          />
        </div>
        
        {/* Column 3: Code/Preview */}
        <div className="workspace-column bg-night-lighter flex-grow">
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
