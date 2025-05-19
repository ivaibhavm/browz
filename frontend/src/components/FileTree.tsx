import React from 'react';
import { File, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  onFileSelect: (fileId: string) => void;
  selectedFileId?: string;
  className?: string;
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  onFileSelect,
  selectedFileId,
  className
}) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({});

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = !!expandedFolders[node.id];
    const isSelected = node.id === selectedFileId;
    
    const indentClass = `pl-${(depth + 1) * 3}`;
    
    return (
      <React.Fragment key={node.id}>
        <div 
          className={cn(
            indentClass,
            "py-1.5 flex items-center gap-2 text-sm cursor-pointer rounded-md transition-all duration-100 group",
            isSelected ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          )}
          onClick={() => isFolder ? toggleFolder(node.id) : onFileSelect(node.id)}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown size={16} className="flex-shrink-0" />
              ) : (
                <ChevronRight size={16} className="flex-shrink-0" />
              )}
              <Folder size={16} className="text-zinc-300 flex-shrink-0" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File size={16} className="text-zinc-400 flex-shrink-0" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        
        {isFolder && isExpanded && node.children?.map(child => renderFileNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className={cn("p-4", className)}>
      <h2 className="text-lg font-medium text-white mb-4">Files</h2>
      
      <div className="code-font">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

export default FileTree;
