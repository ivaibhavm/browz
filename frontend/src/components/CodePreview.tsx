import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Code, EyeIcon } from 'lucide-react';

interface CodePreviewProps {
  fileId?: string;
  code: string;
  previewUrl?: string;
  className?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  fileId,
  code,
  previewUrl = 'about:blank',
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('preview');
  
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
          <h2 className="text-lg font-medium text-white">{fileId ? `File: ${fileId}` : 'Preview'}</h2>
          
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
          <div className="h-full w-full bg-white rounded-md overflow-hidden">
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-grow m-0 p-0 h-full">
          <div className="h-full p-4 overflow-auto code-font bg-night-darker text-zinc-300 text-sm">
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
