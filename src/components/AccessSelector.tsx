import React from "react";
import subscribedControllerImage from "../assets/subscribedOptions.png";
import subscribedPlusPayImage from "../assets/allOptions.png";
import { AccessLabel, StepKey } from "../lib/types";
import Image from "next/image";

interface Props {
  selectedAccessLabels: AccessLabel[];
  setSelectedAccessLabels: React.Dispatch<React.SetStateAction<AccessLabel[]>>;
  setStep: React.Dispatch<React.SetStateAction<StepKey>>;
}

const AccessSelector = ({ selectedAccessLabels, setSelectedAccessLabels, setStep }: Props) => {
  // Toggle default required included and included + all on user click of all.
  const handleAccessLabelClick = (label: AccessLabel) => {
    if (label === "Included") {
      return;
    }
    if (selectedAccessLabels.includes("All")) {
      setSelectedAccessLabels(["Included"]);
    } else {
      setSelectedAccessLabels(["Included", "All"]);
    }
  };

  // Button data for subscription and subscription + paid options.
  const accessOptions = [
    { label: "Included", icon: subscribedControllerImage, tooltip: "Show me only what I subscribe to (free to me)" },
    { label: "All", icon: subscribedPlusPayImage, tooltip: "Show me everything, include rent or buy" },
  ] as const;

  // Step 1 buttons to set user access.
  const accessButtons = accessOptions.map(({ label, icon, tooltip }) => {
    const isActive = selectedAccessLabels.includes(label);
    return (
      <button
        key={label}
        type="button"
        onClick={() => handleAccessLabelClick(label)}
        title={tooltip}
        className={`priority cursor-pointer flex-shrink-0 h-full p-2 rounded-lg border transition
                           ${isActive ? "border-4 border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-400" : "border border-gray-300 hover:border-gray-800"}
                           `}
      >
        <Image src={icon.src} alt={label} width={200} height={200} className="object-contain h-full w-auto" unoptimized />
      </button>
    );
  });
  return (
    <div className="flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-6 text-[#2B1A82]">Select Type of Services </h2>
      <div className="flex justify-center items-center space-x-8 h-56">{accessButtons}</div>
      <button onClick={() => setStep(2)} className="cursor-pointer w-48 mx-auto mt-8 py-2 px-4 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] transition-colors">
        Next
      </button>
    </div>
  );
};

export default AccessSelector;
