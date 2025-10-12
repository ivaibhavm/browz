import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step } from '@/types';

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
      <div className="space-y-3">
        <h1 className='text-white p-1'>Project files</h1>
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
                {step.status=='completed' ? (
                  <CheckCircle size={18} className="text-primary" />
                ) : (
                  <Circle size={18} className="text-zinc-400" />
                )}
              </div>
              <div>
                <h3 className={cn(
                  "font-medium mb-1 text-sm", 
                  step.status=='completed' ? "text-zinc-300" : "text-white"
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
