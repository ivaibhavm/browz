import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import StepsList from './StepsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import CodePreview from './CodePreview';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { parseSteps } from '@/parseSteps';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';
import { StepType, type FileItem, type Step } from '@/types';
import FileExplorer from './FileExplorer';
import { CodeEditor } from './CodeEditor';


const WorkspaceLayout = () => {
  const location = useLocation()
  const prompt = location.state?.prompt
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<string>('code');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure: FileItem[] = [...originalFiles];
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = "";
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            const file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              });
            } else {
              file.content = step.code;
            }
          } else {
            const folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
  
            currentFileStructure = (currentFileStructure.find(x => x.path === currentFolder)!).children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
  }, [files, steps]);

  async function init() {
    const templateResponse = await axios.post(`${BACKEND_URL}/api/template`, {
      prompt: prompt
    });

    const {prompts} = templateResponse.data;

    setSteps(parseSteps(templateResponse.data.uiPrompts))

    const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setSteps(s => [...s, ...parseSteps(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as const
    }))])
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
  
  
  return (
    <div className={cn("h-screen overflow-auto flex flex-col")}>
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
      
      <div className="flex-grow grid grid-cols-1 m-4 gap-4 md:grid-cols-[400px_1fr] xl:grid-cols-[400px_1fr] h-full overflow-hidden">
        
        <div className="workspace-column rounded-lg h-full flex flex-col overflow-hidden backdrop-blur-sm border border-[#333] bg-[#101010]">
          <StepsList 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
            className="flex-1 min-h-0 overflow-auto custom-scrollbar"
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
        
        <div className="workspace-column rounded-lg backdrop-blur-sm  border border-[#333] bg-[#101010] flex-grow max-h-screen overflow-auto custom-scrollbar">
          <div className={cn("flex flex-col h-full")}>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                
                <TabsList className="grid grid-cols-2 w-[180px]">
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <span>Code</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <span>Preview</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="flex-grow m-0 p-0">
                <div className="h-full w-full rounded-md overflow-hidden">
                  Preview iframe
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="flex-grow m-0 p-0 h-full">
                <div className="flex code-font h-full text-zinc-300 text-sm">
                  <div className="w-1/4">
                    <FileExplorer 
                      files={files} 
                      onFileSelect={handleFileSelect} 
                    />
                  </div>
                  <div className='w-3/4'><CodeEditor file={selectedFile} /></div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
