"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import sources from "../../data/watchmodeSources.json";
import { fetchWatchmodeAutocomplete, fetchOmdbTitle, fetchWatchmodeTitleResults, fetchWatchmodeTitleSources } from "@/lib/api";
import { TitleData, TitleAutocomplete, TitleResult, Source, accessChoices, AccessLabel } from "../lib/types";
import subscribedControllerImage from "../assets/subscribedOptions.png";
import subscribedPlusPayImage from "../assets/allOptions.png";
import missingImage from "../assets/imageNotAvailable.png";
import debounce from "lodash/debounce";

const StepWizard = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [selectedAccessLabels, setSelectedAccessLabels] = useState<AccessLabel[]>(["Included"]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [autocompleteResults, setAutocompleteResults] = useState<TitleAutocomplete[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const [omdbData, setOmdbData] = useState<TitleData | null>(null);
  const [watchmodeTitleData, setWatchmodeTitleData] = useState<TitleResult[] | null>(null);
  const [watchmodeSourceData, setWatchmodeSourceData] = useState<Source[]>([]);

  const [expandedTitleId, setExpandedTitleId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [searchTermError, setSearchTermError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const selectedAccessTypes = selectedAccessLabels.flatMap((lbl) => accessChoices[lbl]);

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

  const handleSourceSelect = (sourceId: number) => {
    const updatedSources = selectedSources.includes(sourceId) ? selectedSources.filter((s) => s !== sourceId) : [...selectedSources, sourceId];

    if (updatedSources.length === 0) {
      setSourcesError("Select at least one source.");
    } else {
      setSourcesError(null);
    }
    setSelectedSources(updatedSources);
  };

  const debouncedSearch = debounce(async (value: string) => {
    if (value.trim().length > 0) {
      try {
        setLoading(true);
        const results = await fetchWatchmodeAutocomplete(value);
        setAutocompleteResults(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setFetchError("Error fetching search results.");
        setLoading(false);
      }
    } else {
      setAutocompleteResults([]);
    }
  }, 1000);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);

    if (value.trim().length === 0 || !/[a-zA-Z]/.test(value)) {
      setSearchTermError("Enter a valid search term (at least one letter).");
    } else {
      setSearchTermError(null);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const handleNextStep2 = () => {
    if (selectedSources.length === 0) {
      setSourcesError("Select at least one service.");
      return;
    }
    setSourcesError(null);
    setStep(3);
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
      setSearchTermError("Enter a valid search term (at least one letter).");
      return;
    }
    setSearchTermError(null);
    setLoading(true);
    setFetchError(null);
    setOmdbData(null);
    setWatchmodeTitleData(null);
    setWatchmodeSourceData([]);

    try {
      const [omdb, titles] = await Promise.all([fetchOmdbTitle(searchTerm), fetchWatchmodeTitleResults(searchTerm)]);
      if (!omdb) throw new Error("No OMDb data");
      if (!titles?.length) throw new Error("No titles found");
      setOmdbData(omdb);
      setWatchmodeTitleData(titles);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSelect = (title: string) => {
    setSearchTerm(title);
    setAutocompleteResults([]);
  };

  const handleTitleRowClick = async (id: number) => {
    setExpandedTitleId(id);
    setWatchmodeSourceData([]);
    setFetchError(null);
    try {
      setLoading(true);
      const sources = await fetchWatchmodeTitleSources(id, selectedSources, selectedAccessTypes);
      setWatchmodeSourceData(sources);
      if (sources.length === 0) {
        setFetchError("No services available for this title with your filters.");
      }
    } catch (e) {
      console.error(e);
      setFetchError("Error fetching services for this title.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 4) {
      if (selectedSources.length === 0) {
        setSourcesError("Select at least one source.");
      }

      if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
        setSearchTermError("Enter a valid search term (at least one letter).");
      }
    }
  }, [step, selectedSources, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setAutocompleteResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (step !== 3) {
      setOmdbData(null);
      setWatchmodeTitleData(null);
      setWatchmodeSourceData([]);
      setAutocompleteResults([]);
      setExpandedTitleId(null);
      setFetchError(null);
    }
  }, [step]);

  const handleSelectAllToggle = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
      setSourcesError("Select at least one service.");
    } else {
      setSelectedSources(sources.map((s) => s.id));
      setSourcesError(null);
    }
  };

  const steps = ["Access", "Platforms", "Search"];

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((name, idx) => {
            const isDone = step > idx + 1;
            const isActive = step === idx + 1;
            return (
              <React.Fragment key={name}>
                <div
                  onClick={() => handleStepClick(idx + 1)}
                  className={`
                    cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${isDone ? "bg-[#7E69FF] border-[#7E69FF] text-white" : isActive ? "bg-[#4F67FF] border-[#4F67FF] text-white" : "bg-white border-[#E1E3FF] text-[#2B1A82]"}
            `}
                >
                  <span className="text-lg font-semibold leading-none">{idx + 1}</span>
                </div>

                {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 transition-colors ${isDone ? "bg-[#7E69FF]" : "bg-[#E1E3FF]"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex justify-between text-lg font-semibold text-[#2B1A82]">
          {steps.map((name) => (
            <span key={name} className="w-8 text-center">
              {name}
            </span>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-6 text-[#2B1A82]">Choose Your Search Scope</h2>
          <div className="flex justify-center space-x-8">
            {(
              [
                { label: "Included", icon: subscribedControllerImage, tooltip: "Show me only what I subscribe to" },
                { label: "All", icon: subscribedPlusPayImage, tooltip: "Show me everything, including pay-per-view" },
              ] as const
            ).map(({ label, icon, tooltip }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleAccessLabelClick(label)}
                title={tooltip}
                className={`cursor-pointer p-2 rounded-lg border transition 
               ${selectedAccessLabels.includes(label) ? "border-4 border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-400" : "border border-gray-300 hover:border-gray-800"}`}
              >
                <img src={icon.src} alt={label} className="w-50 h-50" />
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="cursor-pointer w-48 mx-auto mt-8 py-2 px-4 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] transition-colors">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#2B1A82]">Select Streaming Services</h2>
            <button
              type="button"
              onClick={handleSelectAllToggle}
              className="
          cursor-pointer
          text-sm font-medium 
          text-[#4F67FF] 
          hover:bg-[#D8DAFE] 
          px-2 py-1 rounded 
          transition-colors
        "
            >
              {selectedSources.length === sources.length ? "Clear All" : "Select All"}
            </button>
          </div>
          <div className="h-56 overflow-y-auto bg-[#FCFCFF] p-2 rounded-lg">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {sources.map((src) => {
                const isChecked = selectedSources.includes(src.id);
                return (
                  <label
                    key={src.id}
                    className={`
                relative flex flex-col items-center
                w-20 h-24 p-2 border rounded-lg cursor-pointer transition-colors
                ${isChecked ? "border-[#4F67FF] ring-2 ring-[#D8DAFE] bg-[#F0F2FF]" : "border-[#E1E3FF] bg-white hover:bg-[#F0F2FF]"}
              `}
                  >
                    <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => handleSourceSelect(src.id)} />
                    <div className="w-14 h-14 flex-shrink-0 mb-1">
                      <img src={src.logo_100px} alt={src.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="mt-auto text-xs font-semibold text-[#2B1A82] text-center truncate w-full" title={src.name}>
                      {src.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button onClick={handleNextStep2} className=" cursor-pointer w-48 mx-auto mt-8 py-2 px-4 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] transition-colors">
            Next
          </button>
          {sourcesError && <p className="mt-4 flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{sourcesError}</p>}
        </div>
      )}

      {step === 3 && (
        <>
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

                <button onClick={handleSearch} disabled={loading || selectedSources.length === 0} className="cursor-pointer px-4 py-2 bg-[#4F67FF] text-white rounded-lg hover:bg-[#7E69FF] disabled:opacity-50 transition-colors">
                  Find Availability
                </button>
              </div>

              {autocompleteResults.length > 0 && (
                <ul className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
                  {autocompleteResults.map((r) => (
                    <li key={r.id} onClick={() => handleTitleSelect(r.name)} className="cursor-pointer hover:bg-gray-100 p-2">
                      {r.name} <span className="text-gray-500">({r.year})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {searchTermError && <p className="mt-4 flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{searchTermError}</p>}
          </div>
          {omdbData && (
            <div className="mb-6 bg-white rounded-xl shadow-md border border-[#7E69FF] p-6 flex gap-6">
              <img
                src={omdbData.Poster}
                alt={omdbData.Title}
                className="w-32 flex-shrink-0 rounded-lg shadow-sm border border-[#E1E3FF]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = missingImage.src;
                }}
              />
              <div>
                <h1 className="text-2xl font-bold mb-2 text-[#2B1A82]">
                  {omdbData.Title} <span className="text-[#7E69FF]">({omdbData.Year})</span>
                </h1>
                <p className="text-[#2B1A82]">{omdbData.Plot}</p>
              </div>
            </div>
          )}

          {watchmodeTitleData && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#2B1A82]">Matching Results (Select One)</h2>

              <div className="overflow-y-auto max-h-80  mb-6 rounded-lg shadow-sm border border-[#7E69FF]">
                <table className="w-full table-auto">
                  <thead className="sticky top-0 bg-[#4F67FF]">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Year</th>
                      <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {watchmodeTitleData.map((t, idx) => {
                      const isActive = expandedTitleId === t.id;
                      const isDefaultMatch = expandedTitleId === null && omdbData?.imdbID && t.imdb_id === omdbData.imdbID;
                      const isHighlighted = isActive || isDefaultMatch;

                      return (
                        <tr key={t.id} onClick={() => handleTitleRowClick(t.id)} className={`cursor-pointer transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#F0F2FF]" : ""} hover:bg-[#D8DAFE] ${isHighlighted ? "bg-[#D8DAFE] font-bold" : ""}`}>
                          <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82]">{isHighlighted ? <strong>{t.name}</strong> : t.name}</td>
                          <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82]">{t.year}</td>
                          <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82] capitalize">{t.type.replace(/_/g, " ")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {expandedTitleId !== null && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#2B1A82]">Viewing Options</h2>

              <div className="mb-6 bg-white rounded-xl shadow-md border border-[#7E69FF] p-4 min-h-[6.5rem] max-h-72 overflow-y-auto">
                {fetchError ? (
                  <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{fetchError}</div>
                ) : watchmodeSourceData.length > 0 ? (
                  watchmodeSourceData
                    .filter((s, i, arr) => arr.findIndex((x) => x.source_id === s.source_id) === i)
                    .map((src) => {
                      const typeNames: Record<string, string> = {
                        sub: "Subscription",
                        free: "Free",
                        tve: "TV App",
                        buy: "Buy",
                        rent: "Rent",
                      };
                      const label = typeNames[src.type] || src.type;
                      const price = src.price != null ? `$${src.price}` : "—";
                      return (
                        <div key={src.source_id} className="border border-[#E1E3FF] bg-white rounded-lg p-4 flex justify-between items-center mb-4">
                          <div>
                            <p className="font-semibold text-[#2B1A82]">{src.name}</p>
                            <p className="text-xs font-medium text-[#4F67FF]">
                              {label}
                              {price !== "—" && ` (${price})`}
                            </p>
                          </div>
                          <a href={src.web_url} target="_blank" rel="noopener noreferrer" className="bg-[#4F67FF] text-white py-1 px-4 rounded-lg hover:bg-[#7E69FF] transition-colors">
                            Watch
                          </a>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">No services available for this title with your streaming platforms.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StepWizard;
