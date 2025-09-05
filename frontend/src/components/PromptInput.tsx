import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  className?: string;
}

const placeholderSuggestions = [
  "travel agency website in which users can...",
  "blog site for sharing recipes, including...",
  "interactive dashboard for tracking fitness progress and...",
  "personal finance tracker that visualizes expenses...",
  "music streaming platform homepage featuring...",
  "online bookstore with search and...",
  "news website displaying articles by...",
  "real estate listings site with map view...",
  "event management site showing upcoming events and...",
  "nonprofit organization homepage sharing their mission...",
  "community forum with featured discussions...",
  "tech conference website detailing agenda, speakers...",
  "movie database where users can..."
];

const PromptInput: React.FC<PromptInputProps> = ({ className }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const staticPrefix = "Create a ";
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable)) {
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setPrompt(p => p + e.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    const fullText = placeholderSuggestions[placeholderIndex];

    if (!isDeleting && animatedText.length < fullText.length) {
      // Typing phase
      typingTimeout = setTimeout(() => {
        setAnimatedText(fullText.slice(0, animatedText.length + 1));
      }, 30);
    } else if (!isDeleting && animatedText.length === fullText.length) {
      // Pause before deleting
      typingTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 600);
    } else if (isDeleting && animatedText.length > 0) {
      // Deleting phase
      typingTimeout = setTimeout(() => {
        setAnimatedText(fullText.slice(0, animatedText.length - 1));
      }, 5);
    } else if (isDeleting && animatedText.length === 0) {
      // Move to next suggestion
      typingTimeout = setTimeout(() => {
        setIsDeleting(false);
        setPlaceholderIndex((i) => (i + 1) % placeholderSuggestions.length);
      }, 300);
    }
    return () => clearTimeout(typingTimeout);
  }, [animatedText, isDeleting, placeholderIndex]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulating a brief loading state before navigation
    setTimeout(() => {
      navigate('/workspace' , { state : {prompt} });
    }, 600);
  };
  
  return (
    <div className={cn("w-200 mx-auto px-4 mb-10", className)}>
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
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={staticPrefix + animatedText}
            style={{ height: '50px', width: '100%' }}
            autoFocus
          />
          {prompt.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300"
              disabled={isSubmitting}
            >
              <ArrowRight className="transition-transform duration-300" />
            </Button>
          ) : null }
        </form>
      </Card>
      
    </div>
  );
};

export default PromptInput;
