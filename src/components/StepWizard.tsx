"use client";

import React, { useState, useEffect } from "react";
import StepNavigationBar from "./StepNavigationBar";
import AccessSelector from "./AccessSelector";
import ServicesSelector from "./ServicesSelector";
import SearchInput from "./SearchInput";
import Poster from "./Poster";
import { fetchOmdbTitle, fetchWatchmodeAutocomplete, fetchWatchmodeTitleResults, fetchWatchmodeTitleSources } from "@/lib/api";
import { TitleData, TitleResult, Source, accessChoices, AccessLabel, StepKey, TitleAutocomplete } from "../lib/types";
import missingImage from "../assets/noImage.png";
import debounce from "lodash/debounce";

const StepWizard = () => {
  const [step, setStep] = useState<StepKey>(1);
  const [selectedAccessLabels, setSelectedAccessLabels] = useState<AccessLabel[]>(["Included"]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [omdbData, setOmdbData] = useState<TitleData | null>(null);
  const [watchmodeTitleData, setWatchmodeTitleData] = useState<TitleResult[] | null>(null);
  const [watchmodeSourceData, setWatchmodeSourceData] = useState<Source[]>([]);

  const [expandedTitleId, setExpandedTitleId] = useState<number | null>(null);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [searchTermError, setSearchTermError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const selectedAccessTypes = selectedAccessLabels.flatMap((lbl) => accessChoices[lbl]);

  const [autocompleteResults, setAutocompleteResults] = useState<TitleAutocomplete[]>([]);

  // Navigate directly to step clicking on circled number.
  const handleStepClick = (stepNumber: StepKey) => {
    setStep(stepNumber);
  };

  // Reset step 3 search errors and search results.
  const resetErrorsAndData = () => {
    setFetchError(null);
    setSearchTermError(null);
    setOmdbData(null);
    setWatchmodeSourceData([]);
    setWatchmodeTitleData(null);
    setAutocompleteResults([]);
    setExpandedTitleId(null);
  };

  // Reset step 3 search errors and search results when not on step 3.
  useEffect(() => {
    if (step !== 3) {
      resetErrorsAndData();
    }
  }, [step]);

  // Search omdb for title image and plot and watchmode for results that include title.
  const handleSearch = async () => {
    if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
      setSearchTermError("Enter a valid search term (at least one letter).");
      return;
    }
    resetErrorsAndData();
    setLoading(true);

    try {
      const [omdb, titles] = await Promise.all([fetchOmdbTitle(searchTerm), fetchWatchmodeTitleResults(searchTerm)]);
      if (!omdb) throw new Error("No OMDb data");
      if (!titles?.length) throw new Error("No titles found");
      setOmdbData(omdb);
      setWatchmodeTitleData(titles);
    } catch (error: unknown) {
      let message: string;

      if (typeof error === "string") {
        message = error;
      } else if (error instanceof Error) {
        message = error.message;
      } else {
        message = "An unexpected error occurred";
      }

      setFetchError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch title recommendations based on user input called each keystroke, run only when input stops 1.5 seconds.
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
  }, 1500);

  // Populate search term with user selected title from autocomplete results.
  const handleAutocompleteTitleSelect = (title: string) => {
    setSearchTerm(title);
    setAutocompleteResults([]);
  };

  // Fetch services matching user submitted filters and display viewing options.
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

  const omdbTitleContainer = omdbData && (
    <div className="mb-6 bg-white rounded-xl shadow-md border border-[#7E69FF] p-6 flex gap-6">
      <Poster posterUrl={omdbData.Poster} title={omdbData.Title} missingImage={missingImage} />

      <div>
        <h1 className="text-2xl font-bold mb-2 text-[#2B1A82]">
          {omdbData.Title} <span className="text-[#7E69FF]">({omdbData.Year})</span>
        </h1>
        <p className="text-[#2B1A82]">{omdbData.Plot}</p>
      </div>
    </div>
  );

  const watchmodeMatchingResultsContainer = watchmodeTitleData && (
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
            {watchmodeTitleData.map((t, index) => {
              const isActive = expandedTitleId === t.id;
              const isDefaultMatch = expandedTitleId === null && omdbData?.imdbID && t.imdb_id === omdbData.imdbID;
              const isHighlighted = isActive || isDefaultMatch;

              return (
                <tr key={t.id} onClick={() => handleTitleRowClick(t.id)} className={`cursor-pointer transition-colors duration-150 ${index % 2 === 0 ? "bg-[#F0F2FF]" : ""} hover:bg-[#D8DAFE] ${isHighlighted ? "bg-[#D8DAFE] font-bold" : ""}`}>
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
  );

  const viewingOptionsContainer = expandedTitleId !== null && (
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
          <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">No titles available for this title with your streaming services.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto p-6">
      <StepNavigationBar step={step} handleStepClick={handleStepClick} />

      {step === 1 && <AccessSelector selectedAccessLabels={selectedAccessLabels} setSelectedAccessLabels={setSelectedAccessLabels} setStep={setStep} />}

      {step === 2 && <ServicesSelector setStep={setStep} setSourcesError={setSourcesError} setSelectedSources={setSelectedSources} selectedSources={selectedSources} sourcesError={sourcesError} />}

      {step === 3 && (
        <>
          <SearchInput
            handleSearch={handleSearch}
            handleAutocompleteTitleSelect={handleAutocompleteTitleSelect}
            setAutocompleteResults={setAutocompleteResults}
            setSearchTerm={setSearchTerm}
            setSourcesError={setSourcesError}
            setSearchTermError={setSearchTermError}
            loading={loading}
            debouncedSearch={debouncedSearch}
            autocompleteResults={autocompleteResults}
            selectedSources={selectedSources}
            searchTerm={searchTerm}
            sourcesError={sourcesError}
            searchTermError={searchTermError}
            step={step}
          />
          {omdbTitleContainer}
          {watchmodeMatchingResultsContainer}
          {viewingOptionsContainer}
        </>
      )}
    </div>
  );
};

export default StepWizard;
