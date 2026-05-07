import React from 'react';
import Editor from '@monaco-editor/react';
import type { FileItem } from '../types';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme('dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#101010',
      },
    })
  }
  if (!file) {
    return (
      <div className="h-full flex justify-center items-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme="dark"
      beforeMount={handleEditorWillMount}
      value={file.content || ''}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        renderLineHighlight: 'none',
      }}
    />
  );
}