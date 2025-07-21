import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Code, EyeIcon } from 'lucide-react';
import FileTree from './FileTree';

interface CodePreviewProps {
  fileId?: string;
  code: string;
  previewUrl?: string;
  className?: string;
}

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

const CodePreview: React.FC<CodePreviewProps> = ({ fileId, code, previewUrl = 'about:blank', className}) => {
  const [activeTab, setActiveTab] = useState<string>('preview');
  const [files, setFiles] = useState(initialFiles);
  const [selectedFileId, setSelectedFileId] = useState<string>('App.jsx');
  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
  };
  
  // Reset to preview when file changes
  useEffect(() => {
    setActiveTab('preview');
  }, [fileId]);
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {/* {activeTab == 'code' ? <h2 className="text-lg font-medium text-white">{fileId ? `File: ${fileId}` : 'Preview'}</h2> : null } */}
          
          <TabsList className="grid grid-cols-2 w-[180px]">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <EyeIcon size={14} />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code size={14} />
              <span>Code</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-grow m-0 p-0">
          <div className="h-full w-full rounded-md overflow-hidden">
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-grow m-0 p-0 h-full">
          <div className="h-full p-4 overflow-auto code-font  text-zinc-300 text-sm">
            <FileTree 
              files={files} 
              onFileSelect={handleFileSelect} 
              selectedFileId={selectedFileId} 
            />
            <pre className="whitespace-pre-wrap">
              {code || 'No code to display'}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodePreview;
