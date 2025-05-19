import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  className?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ className }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulating a brief loading state before navigation
    setTimeout(() => {
      // Store the prompt in sessionStorage to access it on the workspace page
      sessionStorage.setItem('prompt', prompt);
      navigate('/workspace');
    }, 600);
  };
  
  return (
    <div className={cn("w-200 mx-auto px-4 mb-20", className)}>
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-medium tracking-tight mb-5 text-white glow-effect">
          What do you want to build today?
        </h1>
        <p className="text-zinc-400 mx-auto">
          Enter a prompt to create your website. Be as specific as you'd like.
        </p>
      </div>
      
      <Card className={cn(
        "glass-effect transition-all duration-300 overflow-hidden", 
        isFocused ? "shadow-lg shadow-primary/20" : ""
      )}>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Create a portfolio site with a dark theme that has..."
            className="pr-12 py-6 bg-transparent border-0 text-black placeholder:text-zinc-500 focus-visible:ring-0"
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300",
              prompt.trim() ? "opacity-100" : "opacity-50 pointer-events-none"
            )}
            disabled={!prompt.trim() || isSubmitting}
          >
            <ArrowRight className={cn(
              "transition-transform duration-300",
              prompt.trim() ? "translate-x-0" : "-translate-x-1"
            )} />
          </Button>
        </form>
      </Card>
      
    </div>
  );
};

export default PromptInput;
