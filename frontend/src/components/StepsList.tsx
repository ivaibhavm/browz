import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import type { Step } from '@/types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  llmMessage?: string;
  className?: string;
}

const StepsList: React.FC<StepsListProps> = ({
  steps,
  currentStep,
  onStepClick,
  llmMessage,
  className
}) => {
  const location = useLocation();
  const prompt = location.state?.prompt;

  return (
    <div className={cn("p-4 space-y-4", className)}>
      {/* User prompt — right-aligned like a sent message */}
      {prompt && (
        <div className="flex justify-end">
          <div className="max-w-[85%] flex items-end gap-2">
            <div className="px-4 py-3 rounded-2xl text-white text-sm bg-neutral-800">
              {prompt}
            </div>
          </div>
        </div>
      )}

      {/* LLM response — left-aligned like a received message */}
      {(llmMessage || steps.length > 0) && (
        <div className="flex justify-between">
          <div className="w-full flex items-start gap-2">
            <div className="space-y-2 w-full">
              {llmMessage && (
                <div className="text-zinc-300 text-sm py-4 leading-relaxed">
                  {llmMessage}
                </div>
              )}

              {steps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "relative px-3 py-2.5 rounded-xl rounded-tl-sm border transition-all duration-200 cursor-pointer",
                    step.id === currentStep
                      ? "bg-white/10 border-emerald-500/30 shadow-sm shadow-emerald-500/5"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/15"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      {step.status === 'completed' ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} className="text-zinc-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={cn(
                        "font-medium text-sm leading-snug",
                        step.status === 'completed' ? "text-zinc-300" : "text-white"
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsList;
