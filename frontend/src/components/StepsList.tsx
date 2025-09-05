import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  className?: string;
}

const StepsList: React.FC<StepsListProps> = ({
  steps,
  currentStep,
  onStepClick,
  className
}) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Steps to follow</h2>
        <span className="text-sm text-white">
          {steps.filter(s => s.completed).length}/{steps.length} complete
        </span>
      </div>
      
      <div className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={cn(
              "relative p-3 rounded-lg border border-white/10 transition-all duration-200 cursor-pointer",
              step.id === currentStep 
                ? "bg-white/10 shadow-sm" 
                : "bg-transparent hover:bg-white/5"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-primary flex-shrink-0">
                {step.completed ? (
                  <CheckCircle size={18} className="text-primary" />
                ) : (
                  <Circle size={18} className="text-zinc-400" />
                )}
              </div>
              <div>
                <h3 className={cn(
                  "font-medium mb-1 text-sm", 
                  step.completed ? "text-zinc-300" : "text-white"
                )}>
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-xs">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsList;
