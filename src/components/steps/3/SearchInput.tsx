"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { StepKey, TitleAutocomplete } from "../../../lib/types";
import { DebouncedFunc } from "lodash";

interface Props {
  handleSearch: () => Promise<void>;
  handleAutocompleteTitleSelect: (title: string) => void;
  setAutocompleteResults: React.Dispatch<React.SetStateAction<TitleAutocomplete[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSourcesError: React.Dispatch<React.SetStateAction<string | null>>;
  setSearchTermError: React.Dispatch<React.SetStateAction<string | null>>;
  searchLoading: boolean;
  debouncedSearch: DebouncedFunc<(value: string) => Promise<void>>;
  autocompleteResults: TitleAutocomplete[];
  selectedSources: number[];
  searchTerm: string;
  sourcesError: string | null;
  searchTermError: string | null;
  step: StepKey;
}

const SearchInput = ({ handleSearch, handleAutocompleteTitleSelect, setAutocompleteResults, setSearchTerm, setSourcesError, setSearchTermError, searchLoading, debouncedSearch, autocompleteResults, selectedSources, searchTerm, sourcesError, searchTermError, step }: Props) => {
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Call validation if step 3 && no sources selected.
  useEffect(() => {
    if (step === 3 && selectedSources.length === 0) {
      setSourcesError("Select at least one service.");
    }
  }, [step, selectedSources, setSourcesError]);

  // Cleanup on unmount SearchInput
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Track clicks in step 3 outside div containing search input, find availability button and dropdown results.
  useEffect(() => {
    if (step !== 3) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteResults.length > 0 && autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setAutocompleteResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [step, autocompleteResults, setAutocompleteResults]);

  // Set search term as user types and trigger debounce for recommended search terms.
  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);

      if (value.trim().length === 0 || !/[a-zA-Z]/.test(value)) {
        setSearchTermError("Enter a valid search term (at least one letter).");
      } else {
        setSearchTermError(null);
      }
    },
    [setSearchTerm, debouncedSearch, setSearchTermError]
  );

  const searchDropdown = useMemo(() => {
    if (autocompleteResults.length === 0) return null;

    return (
      <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
        {autocompleteResults.map((r) => (
          <li key={r.id} onClick={() => handleAutocompleteTitleSelect(r.name)} className="cursor-pointer hover:bg-gray-100 p-2">
            {r.name} <span className="text-gray-500">({r.year})</span>
          </li>
        ))}
      </ul>
    );
  }, [autocompleteResults, handleAutocompleteTitleSelect]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-[#2B1A82]">Enter Show or Movie Title</h2>

      <div ref={autocompleteRef} className="relative mb-2">
        <div className="flex space-x-2">
          <input
            type="text"
            name="searchTerm"
            className="flex-1 px-4 py-2 border-2 border-[#7E69FF] rounded-lg text-[#2B1A82] placeholder-[#7E69FF] focus:outline-none focus:border-[#4F67FF] focus:ring-2 focus:ring-[#D8DAFE] transition-colors"
            placeholder="Enter movie or TV show…"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />

          <button onClick={handleSearch} disabled={searchLoading || selectedSources.length === 0} className="cursor-pointer px-4 py-2 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] disabled:opacity-50 transition-colors">
            Find Availability
          </button>
        </div>
        {searchDropdown}
      </div>
      {sourcesError && <p className="mt-4 flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{sourcesError}</p>}
      {searchTermError && <p className="mt-4 flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{searchTermError}</p>}
    </div>
  );
};

export default React.memo(SearchInput);
