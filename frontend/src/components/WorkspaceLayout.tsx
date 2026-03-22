import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import StepsList from './StepsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKEND_URL } from '@/config';
import axios from 'axios';
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
    // const templateResponse = `<Artifact id=\"project-import\" title=\"Project Files\"><Action type=\"file\" filePath=\"src/App.tsx\">import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n</Action><Action type=\"file\" filePath=\"src/index.css\">@tailwind base;\n@tailwind components;\n@tailwind utilities;\n</Action><Action type=\"file\" filePath=\"src/main.tsx\">import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n</Action><Action type=\"file\" filePath=\"src/vite-env.d.ts\">/// <reference types=\"vite/client\" />\n</Action><Action type=\"file\" filePath=\"eslint.config.js\">import js from '@eslint/js';\nimport globals from 'globals';\nimport reactHooks from 'eslint-plugin-react-hooks';\nimport reactRefresh from 'eslint-plugin-react-refresh';\nimport tseslint from 'typescript-eslint';\n\nexport default tseslint.config(\n  { ignores: ['dist'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: ['**/*.{ts,tsx}'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      'react-hooks': reactHooks,\n      'react-refresh': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      'react-refresh/only-export-components': [\n        'warn',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n</Action><Action type=\"file\" filePath=\"index.html\"><!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n</Action><Action type=\"file\" filePath=\"package.json\">{\n  \"name\": \"vite-react-typescript-starter\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"lint\": \"eslint .\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"lucide-react\": \"^0.344.0\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  },\n  \"devDependencies\": {\n    \"@eslint/js\": \"^9.9.1\",\n    \"@types/react\": \"^18.3.5\",\n    \"@types/react-dom\": \"^18.3.0\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"autoprefixer\": \"^10.4.18\",\n    \"eslint\": \"^9.9.1\",\n    \"eslint-plugin-react-hooks\": \"^5.1.0-rc.0\",\n    \"eslint-plugin-react-refresh\": \"^0.4.11\",\n    \"globals\": \"^15.9.0\",\n    \"postcss\": \"^8.4.35\",\n    \"tailwindcss\": \"^3.4.1\",\n    \"typescript\": \"^5.5.3\",\n    \"typescript-eslint\": \"^8.3.0\",\n    \"vite\": \"^5.4.2\"\n  }\n}\n</Action><Action type=\"file\" filePath=\"postcss.config.js\">export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n</Action><Action type=\"file\" filePath=\"tailwind.config.js\">/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n</Action><Action type=\"file\" filePath=\"tsconfig.app.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"src\"]\n}\n</Action><Action type=\"file\" filePath=\"tsconfig.json\">{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n</Action><Action type=\"file\" filePath=\"tsconfig.node.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"lib\": [\"ES2023\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"vite.config.ts\"]\n}\n</Action><Action type=\"file\" filePath=\"vite.config.ts\">import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: ['lucide-react'],\n  },\n});\n</Action></Artifact>`
    // setSteps(parseSteps(templateResponse))

    // const stepsResponse = `<Artifact id=\"note-taking-app\" title=\"React Typescript Note Taking App\">\n  <Action type=\"file\" filePath=\"package.json\">\n    {\n      \"name\": \"note-taking-app\",\n      \"version\": \"0.1.0\",\n      \"private\": true,\n      \"dependencies\": {\n        \"@heroicons/react\": \"^2.0.16\",\n        \"@types/node\": \"^18.14.6\",\n        \"@types/react\": \"^18.0.28\",\n        \"@types/react-dom\": \"^18.0.11\",\n        \"react\": \"^18.2.0\",\n        \"react-dom\": \"^18.2.0\",\n        \"react-scripts\": \"5.0.1\",\n        \"tailwindcss\": \"^3.2.7\",\n        \"typescript\": \"^4.9.5\"\n      },\n      \"scripts\": {\n        \"start\": \"react-scripts start\",\n        \"build\": \"react-scripts build\",\n        \"test\": \"react-scripts test\",\n        \"eject\": \"react-scripts eject\"\n      },\n      \"eslintConfig\": {\n        \"extends\": [\n          \"react-app\",\n          \"react-app/jest\"\n        ]\n      },\n      \"browserslist\": {\n        \"production\": [\n          \">0.2%\",\n          \"not dead\",\n          \"not op_mini all\"\n        ],\n        \"development\": [\n          \"last 1 chrome version\",\n          \"last 1 firefox version\",\n          \"last 1 safari version\"\n        ]\n      }\n    }\n  </Action>\n\n  <Action type=\"shell\">\n    npm install\n  </Action>\n\n  <Action type=\"file\" filePath=\"src/index.css\">\n    @tailwind base;\n    @tailwind components;\n    @tailwind utilities;\n  </Action>\n\n  <Action type=\"file\" filePath=\"src/index.tsx\">\n    import React from 'react';\n    import ReactDOM from 'react-dom/client';\n    import App from './App';\n    import './index.css';\n\n    const root = ReactDOM.createRoot(\n      document.getElementById('root') as HTMLElement\n    );\n    root.render(\n      <React.StrictMode>\n        <App />\n      </React.StrictMode>\n    );\n  </Action>\n\n  <Action type=\"file\" filePath=\"src/App.tsx\">\n    import React, { useState, useEffect } from 'react';\n    import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';\n\n    interface Note {\n      id: string;\n      title: string;\n      content: string;\n    }\n\n    function App() {\n      const [notes, setNotes] = useState<Note[]>([]);\n      const [newNote, setNewNote] = useState<Note>({ id: '', title: '', content: '' });\n\n      useEffect(() => {\n        // Load notes from local storage on initial render\n        const storedNotes = localStorage.getItem('notes');\n        if (storedNotes) {\n          setNotes(JSON.parse(storedNotes));\n        }\n      }, []);\n\n      useEffect(() => {\n        // Save notes to local storage whenever the notes array changes\n        localStorage.setItem('notes', JSON.stringify(notes));\n      }, [notes]);\n\n      const handleAddNote = () => {\n        if (newNote.title.trim() !== '') {\n          setNotes([...notes, { ...newNote, id: crypto.randomUUID() }]);\n          setNewNote({ id: '', title: '', content: '' });\n        }\n      };\n\n      const handleDeleteNote = (id: string) => {\n        setNotes(notes.filter((note) => note.id !== id));\n      };\n\n      return (\n        <div className=\"min-h-screen bg-gray-100 flex flex-col items-center justify-center\">\n          <div className=\"w-full max-w-md bg-white shadow-lg rounded-lg p-8\">\n            <h1 className=\"text-2xl font-bold mb-4\">Note Taking App</h1>\n            <div className=\"mb-4\">\n              <input\n                type=\"text\"\n                placeholder=\"Note title\"\n                value={newNote.title}\n                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}\n                className=\"w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n              />\n            </div>\n            <div className=\"mb-4\">\n              <textarea\n                placeholder=\"Note content\"\n                value={newNote.content}\n                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}\n                className=\"w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n              ></textarea>\n            </div>\n            <button\n              onClick={handleAddNote}\n              className=\"bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n            >\n              <PlusIcon className=\"h-5 w-5 inline-block mr-2\" /> Add Note\n            </button>\n            <div className=\"mt-8\">\n              {notes.map((note) => (\n                <div\n                  key={note.id}\n                  className=\"bg-gray-200 rounded-md p-4 mb-4 flex justify-between items-center\"\n                >\n                  <div>\n                    <h3 className=\"font-bold\">{note.title}</h3>\n                    <p>{note.content}</p>\n                  </div>\n                  <button\n                    onClick={() => handleDeleteNote(note.id)}\n                    className=\"text-red-500 hover:text-red-600 focus:outline-none\"\n                  >\n                    <TrashIcon className=\"h-5 w-5\" />\n                  </button>\n                </div>\n              ))}\n            </div>\n          </div>\n        </div>\n      );\n    }\n\n    export default App;\n  </Action>\n\n  <Action type=\"shell\">\n    npm start\n  </Action>\n</Artifact>`
    // setSteps(s => [...s, ...parseSteps(stepsResponse).map(x => ({
    //   ...x,
    //   status: "pending" as const
    // }))])

    const templateResponse = await axios.post(`${BACKEND_URL}/api/template`, {
      prompt: prompt
    });

    const { prompts } = templateResponse.data;

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
