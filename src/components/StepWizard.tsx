"use client";

import { useState, useEffect } from "react";
import { accessTypes } from "@/lib/types";
import sources from "../../data/watchmodeSources.json";

type StepWizardProps = {
  accessTypes: { [key: string]: string };
};

const StepWizard = ({ accessTypes }: StepWizardProps) => {
  const [step, setStep] = useState<number>(1);
  const [selectedAccessTypes, setSelectedAccessTypes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Error messages for Step 4
  const [accessTypesError, setAccessTypesError] = useState<string | null>(null);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [searchTermError, setSearchTermError] = useState<string | null>(null);

  const handleAccessTypeSelect = (accessType: string) => {
    if (selectedAccessTypes.includes(accessType)) {
      setSelectedAccessTypes(selectedAccessTypes.filter((item) => item !== accessType));
    } else {
      setSelectedAccessTypes([...selectedAccessTypes, accessType]);
    }

    // Immediately clear error when any category is selected
    setAccessTypesError(null);
  };

  const handleSourceSelect = (sourceId: number) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((s) => s !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }

    // Immediately clear error when any source is selected
    setSourcesError(null);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Immediately clear error when user types anything
    if (value.trim().length > 0 && /[a-zA-Z]/.test(value)) {
      setSearchTermError(null);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setStep(stepNumber); // Navigate to the clicked step
  };

  // Step 1: Validation to ensure at least one category is selected
  const handleNextStep1 = () => {
    if (selectedAccessTypes.length === 0) {
      setAccessTypesError("Please select at least one category.");
      return;
    }
    setAccessTypesError(null);
    setStep(2);
  };

  // Step 2: Validation to ensure at least one source is selected
  const handleNextStep2 = () => {
    if (selectedSources.length === 0) {
      setSourcesError("Please select at least one source.");
      return;
    }
    setSourcesError(null);
    setStep(3);
  };

  // Step 3: Validation to ensure the search term has at least one letter
  const handleNextStep3 = () => {
    if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
      setSearchTermError("Please enter a valid search term (at least one letter).");
      return;
    }
    setSearchTermError(null);
    setStep(4);
  };

  // Check if the Submit button should be enabled
  const isSubmitDisabled = selectedAccessTypes.length === 0 || selectedSources.length === 0 || searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm);

  const handleSubmitFromIndicator = () => {
    // Validate all steps when the Submit button in Step Indicator is clicked
    let hasError = false;

    // Check access types error
    if (selectedAccessTypes.length === 0) {
      setAccessTypesError("Please select at least one category.");
      hasError = true;
    } else {
      setAccessTypesError(null);
    }

    // Check sources error
    if (selectedSources.length === 0) {
      setSourcesError("Please select at least one source.");
      hasError = true;
    } else {
      setSourcesError(null);
    }

    // Check search term error
    if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
      setSearchTermError("Please enter a valid search term (at least one letter).");
      hasError = true;
    } else {
      setSearchTermError(null);
    }

    // If any errors exist, prevent submission
    if (hasError) return;

    // If no errors, proceed to submit (for example, alert or send data to API)
    alert("Submitted!");
  };

  // Check for errors when Step 4 is populated
  useEffect(() => {
    if (step === 4) {
      // Validate all errors when Step 4 is populated
      if (selectedAccessTypes.length === 0) {
        setAccessTypesError("Please select at least one category.");
      }

      if (selectedSources.length === 0) {
        setSourcesError("Please select at least one source.");
      }

      if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
        setSearchTermError("Please enter a valid search term (at least one letter).");
      }
    }
  }, [step, selectedAccessTypes, selectedSources, searchTerm]);

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        {["Access Level", "Sources", "Search", "Review"].map((stepName, index) => (
          <div
            key={stepName}
            className={`w-1/4 text-center p-2 cursor-pointer ${step === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} rounded-full`}
            onClick={() => handleStepClick(index + 1)} // Navigate to clicked step
          >
            {stepName}
          </div>
        ))}
      </div>

      {/* Step 1: Select Access Types */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Access Type(s)</h2>
          <div className="space-y-2">
            {Object.keys(accessTypes).map((key) => (
              <label key={key} className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" checked={selectedAccessTypes.includes(accessTypes[key])} onChange={() => handleAccessTypeSelect(accessTypes[key])} />
                <span className="ml-2">{key}</span>
              </label>
            ))}
          </div>
          {accessTypesError && <p className="text-red-500">{accessTypesError}</p>}
          <button
            onClick={handleNextStep1} // Handle validation and navigation
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Select Sources */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Sources</h2>
          <div className="space-y-2 overflow-y-auto max-h-60">
            {" "}
            {/* Make the sources list scrollable */}
            {sources.map((source) => (
              <label key={source.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedSources.includes(source.id)}
                  onChange={() => handleSourceSelect(source.id)} // Save source_id
                />
                <span className="ml-2">{source.name}</span> {/* Display source name */}
              </label>
            ))}
          </div>
          {sourcesError && <p className="text-red-500">{sourcesError}</p>}
          <div className="sticky bottom-0 bg-transparent p-4">
            <button
              onClick={handleNextStep2} // Handle validation and navigation
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Enter Search Term */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enter Search Term</h2>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter search term..." value={searchTerm} onChange={handleSearchTermChange} />
          {searchTermError && <p className="text-red-500">{searchTermError}</p>}
          <button
            onClick={handleNextStep3} // Handle validation and navigation
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 4: Submit Button */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review</h2>
          <div className="mb-4">
            <p>
              <strong>Access Types:</strong>{" "}
              {selectedAccessTypes
                .map((value) => {
                  const entry = Object.entries(accessTypes).find(([key, val]) => val === value);
                  return entry ? entry[0] : "";
                })
                .filter((label) => label !== "")
                .join(", ")}{" "}
              {accessTypesError && <span className="text-red-500">{accessTypesError}</span>}
            </p>
            <p>
              <strong>Sources:</strong> {selectedSources.map((key) => sources.find((source) => source.id === key)?.name).join(", ")} {sourcesError && <span className="text-red-500">{sourcesError}</span>}
            </p>
            <p>
              <strong>Search Term:</strong> {searchTerm} {searchTermError && <span className="text-red-500">{searchTermError}</span>}
            </p>
          </div>
          <button
            onClick={handleSubmitFromIndicator} // Trigger form validation and submission
            className={`py-2 px-4 rounded-lg ${isSubmitDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default StepWizard;
