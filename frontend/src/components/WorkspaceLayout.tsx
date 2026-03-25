import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import StepsList from './StepsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '@/api';
import { parseSteps } from '@/parseSteps';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';
import { StepType, type FileItem, type Step } from '@/types';
import FileExplorer from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import useWebContainer from '@/hooks/useWebContainer';
import PreviewFrame from './PreviewFrame';


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
  const [hasOpenedPreview, setHasOpenedPreview] = useState(false);
  const webContainer = useWebContainer();
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'installing' | 'starting' | 'ready' | 'error'>('idle');

  async function init() {
    try {
      const templateResponse = await api.post('/api/template', {
        prompt: prompt
      });

      const { prompts } = templateResponse.data;

      setSteps(parseSteps(templateResponse.data.uiPrompts))

      const stepsResponse = await api.post('/api/chat', {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      })

      setSteps(s => [...s, ...parseSteps(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as const
      }))])
    } catch (err) {
      console.error("init() failed:", err);
      setPreviewStatus('error');
    }
  }
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure: FileItem[] = [...originalFiles];
        const finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
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

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ?
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              )
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }

        return mountStructure[file.name];
      };

      files.forEach(file => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    webContainer?.mount(mountStructure);
  }, [files, webContainer]);

  // Find the current package.json content from the files tree
  const getPackageJsonContent = (fileList: FileItem[]): string | null => {
    for (const f of fileList) {
      if (f.type === 'file' && f.name === 'package.json') return f.content || null;
      if (f.type === 'folder' && f.children) {
        const found = getPackageJsonContent(f.children);
        if (found) return found;
      }
    }
    return null;
  };

  const packageJsonContent = getPackageJsonContent(files);
  const lastInstalledPkgJson = useRef<string | null>(null);
  const devServerStarted = useRef(false);

  // Bootstrap: install deps when package.json appears/changes, start dev server once
  useEffect(() => {
    if (!webContainer || !packageJsonContent) return;

    // Skip if we already installed with this exact package.json
    if (lastInstalledPkgJson.current === packageJsonContent) return;

    let cancelled = false;

    console.log("inside useEffect of workspace layout — (re)installing deps");

    async function bootstrap() {
      try {
        setPreviewStatus('installing');

        // Register server-ready listener only once
        if (!devServerStarted.current) {
          webContainer.on('server-ready', (_port: number, url: string) => {
            if (!cancelled) {
              setPreviewUrl(url);
              setPreviewStatus('ready');
            }
          });
        }

        const installProcess = await webContainer.spawn('npm', ['install']);
        installProcess.output.pipeTo(new WritableStream({
          write(data) { console.log(data); }
        }));

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error('npm install failed');
        }

        if (cancelled) return;

        lastInstalledPkgJson.current = packageJsonContent;

        // Only start the dev server once
        if (!devServerStarted.current) {
          devServerStarted.current = true;

          // Determine the correct start script from the mounted package.json
          let startScript = 'dev'; // default for Vite projects
          try {
            const pkgFile = await webContainer.fs.readFile('/package.json', 'utf-8');
            const pkg = JSON.parse(pkgFile);
            if (pkg.scripts) {
              if (pkg.scripts.dev) {
                startScript = 'dev';
              } else if (pkg.scripts.start) {
                startScript = 'start';
              }
            }
          } catch {
            console.warn('Could not read package.json, defaulting to "dev"');
          }

          setPreviewStatus('starting');
          console.log(`Starting with: npm run ${startScript}`);
          const devProcess = await webContainer.spawn('npm', ['run', startScript]);
          devProcess.output.pipeTo(new WritableStream({
            write(data) { console.log('[dev]', data); }
          }));
        }
      } catch (err) {
        console.error('Preview bootstrap failed:', err);
        if (!cancelled) setPreviewStatus('error');
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [webContainer, packageJsonContent]);

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

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleTabChange = (value: "code" | "preview") => {
    setActiveTab(value);
    if (value === "preview") {
      setHasOpenedPreview(true); // once true, never goes back to false
    }
  };

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
            ) : null}
          </form>
        </div>

        <div className="workspace-column rounded-lg backdrop-blur-sm  border border-[#333] bg-[#101010] flex-grow max-h-screen overflow-auto custom-scrollbar">
          <div className={cn("flex flex-col h-full")}>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
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

              <TabsContent value="preview" className="flex-grow m-0 p-0 h-full" forceMount style={{ display: activeTab === 'preview' ? undefined : 'none' }}>
                <div className="h-full w-full overflow-auto">
                  <PreviewFrame url={previewUrl} status={previewStatus} />
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
                  <div className='w-3/4'>
                    <CodeEditor file={selectedFile} />
                  </div>
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
