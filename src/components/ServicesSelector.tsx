import React from "react";
import Image from "next/image";
import sources from "../../data/watchmodeSources.json";
import { StepKey } from "@/lib/types";

interface Props {
  setSelectedSources: React.Dispatch<React.SetStateAction<number[]>>;
  setSourcesError: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSources: number[];
  sourcesError: string | null;
  setStep: React.Dispatch<React.SetStateAction<StepKey>>;
}

const ServicesSelector = ({ selectedSources, setSelectedSources, sourcesError, setSourcesError, setStep }: Props) => {
  const streamingServices = sources.map((src) => {
    const isChecked = selectedSources.includes(src.id);
    return (
      <label
        key={src.id}
        className={`relative flex flex-col items-center w-20 h-24 p-2 border rounded-lg cursor-pointer transition-colors
                             ${isChecked ? "border-[#4F67FF] ring-2 ring-[#D8DAFE] bg-[#F0F2FF]" : "border-[#E1E3FF] bg-white hover:bg-[#F0F2FF]"}
                             `}
      >
        <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => handleSourceSelect(src.id)} />
        <div className="relative w-14 h-14 flex-shrink-0 mb-1">
          <Image src={src.logo_100px} alt={src.name} className="object-contain" unoptimized priority fill />
        </div>
        <span className="mt-auto text-xs font-semibold text-[#2B1A82] text-center truncate w-full" title={src.name}>
          {src.name}
        </span>
      </label>
    );
  });

  // Toggle clicked source to add or remove from selectedSources array.
  const handleSourceSelect = (sourceId: number) => {
    const updatedSources = selectedSources.includes(sourceId) ? selectedSources.filter((s) => s !== sourceId) : [...selectedSources, sourceId];

    if (updatedSources.length === 0) {
      setSourcesError("Select at least one service.");
    } else {
      setSourcesError(null);
    }
    setSelectedSources(updatedSources);
  };

  // Add or remove all sourceIds to selectedSources array.
  const handleSelectAllToggle = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
      setSourcesError("Select at least one service.");
    } else {
      setSelectedSources(sources.map((s) => s.id));
      setSourcesError(null);
    }
  };

  // Navigate from step 2 > 3 clicking next button. Error if nothing selected.
  const handleNextStep2 = () => {
    if (selectedSources.length === 0) {
      setSourcesError("Select at least one service.");
      return;
    }
    setSourcesError(null);
    setStep(3);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2B1A82]">Select Streaming Services</h2>
        <button type="button" onClick={handleSelectAllToggle} className="cursor-pointer text-sm font-medium text-[#4F67FF] hover:bg-[#D8DAFE] px-2 py-1 rounded transition-colors">
          {selectedSources.length === sources.length ? "Clear All" : "Select All"}
        </button>
      </div>
      <div className="h-56 overflow-y-auto bg-[#FCFCFF] p-2 rounded-lg">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">{streamingServices}</div>
      </div>

      <button onClick={handleNextStep2} className="cursor-pointer w-48 mx-auto mt-8 py-2 px-4 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] transition-colors">
        Next
      </button>
      {sourcesError && <p className="mt-4 flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{sourcesError}</p>}
    </div>
  );
};

export default ServicesSelector;
