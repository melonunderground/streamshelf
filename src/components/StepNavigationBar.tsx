import React from "react";
import { steps, StepKey } from "../lib/types";

interface Props {
  handleStepClick: (stepNumber: StepKey) => void;
  step: StepKey;
}

const StepNavigationBar = ({ handleStepClick, step }: Props) => {
  // Navigation bar for 3 steps.
  const stepBar = steps.map(([key, value]) => {
    const isDone = step > key;
    const isActive = step === key;
    return (
      <React.Fragment key={value}>
        <div
          onClick={() => handleStepClick(key)}
          className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors 
                           ${isDone ? "bg-[#7E69FF] border-[#7E69FF] text-white" : isActive ? "bg-[#4F67FF] border-[#4F67FF] text-white" : "bg-white border-[#E1E3FF] text-[#2B1A82]"}
                           `}
        >
          <span className="text-lg font-semibold leading-none">{key}</span>
        </div>
        {key < steps.length && <div className={`flex-1 h-1 mx-2 transition-colors ${isDone ? "bg-[#7E69FF]" : "bg-[#E1E3FF]"}`} />}
      </React.Fragment>
    );
  });

  // Names for each step.
  const stepBarLabels = steps.map(([, value]) => (
    <span key={value} className="w-8 text-center">
      {value}
    </span>
  ));

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">{stepBar}</div>
      <div className="flex justify-between text-lg font-semibold text-[#2B1A82]">{stepBarLabels}</div>
    </div>
  );
};

export default StepNavigationBar;
