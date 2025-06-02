"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import StepNavigationBar from "./StepNavigationBar";
import AccessSelector from "./steps/1/AccessSelector";
import ServicesSelector from "./steps/2/ServicesSelector";
import SearchInput from "./steps/3/SearchInput";
import TitleContainer from "./steps/3/TitleContainer";
import ViewingOptionsContainer from "./steps/3/ViewingOptionsContainer";
import ResultsContainer from "./steps/3/ResultsContainer";
import { fetchOmdbTitle, fetchWatchmodeAutocomplete, fetchWatchmodeTitleResults, fetchWatchmodeTitleSources } from "@/lib/api";
import { TitleData, TitleResult, Source, accessChoices, AccessLabel, StepKey, TitleAutocomplete } from "../lib/types";
import debounce from "lodash/debounce";

const StepWrapper = () => {
  const [step, setStep] = useState<StepKey>(1);
  const [selectedAccessLabels, setSelectedAccessLabels] = useState<AccessLabel[]>(["Included"]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedTitleId, setExpandedTitleId] = useState<number | null>(null);

  const [omdbData, setOmdbData] = useState<TitleData | null>(null);
  const [watchmodeTitleData, setWatchmodeTitleData] = useState<TitleResult[] | null>(null);
  const [watchmodeSourceData, setWatchmodeSourceData] = useState<Source[]>([]);
  const [autocompleteResults, setAutocompleteResults] = useState<TitleAutocomplete[]>([]);

  const [resultsLoading, setResultsLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [searchTermError, setSearchTermError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // accessChoices is static, avoid rerender unless user changes selectedAccessTypes.
  const selectedAccessTypes = useMemo(() => selectedAccessLabels.flatMap((lbl) => accessChoices[lbl]), [selectedAccessLabels]);

  // Navigate directly to step clicking on circled number.
  const handleStepClick = (stepNumber: StepKey) => {
    setStep(stepNumber);
  };

  // Reset step 3 search errors and search results.
  const resetErrorsAndData = useCallback(() => {
    setFetchError(null);
    setSearchTermError(null);
    setOmdbData(null);
    setWatchmodeSourceData([]);
    setWatchmodeTitleData(null);
    setAutocompleteResults([]);
    setExpandedTitleId(null);
  }, []);

  // Reset step 3 search errors and search results when not on step 3.
  useEffect(() => {
    if (step !== 3) {
      resetErrorsAndData();
    }
  }, [step, resetErrorsAndData]);

  // Search omdb for title image and plot and watchmode for results that include title.
  const handleSearch = useCallback(async () => {
    if (searchTerm.trim().length === 0 || !/[a-zA-Z]/.test(searchTerm)) {
      setSearchTermError("Enter a valid search term (at least one letter).");
      return;
    }
    resetErrorsAndData();
    setSearchLoading(true);

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
      setSearchLoading(false);
    }
  }, [searchTerm, resetErrorsAndData]);

  // Fetch title recommendations based on user input called each keystroke, run only when input stops 1.5 seconds.
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (value.trim().length > 0) {
          try {
            setResultsLoading(true);
            const results = await fetchWatchmodeAutocomplete(value);
            setAutocompleteResults(results);
            setResultsLoading(false);
          } catch (error) {
            console.error("Error fetching search results:", error);
            setFetchError("Error fetching search results.");
            setResultsLoading(false);
          }
        } else {
          setAutocompleteResults([]);
        }
      }, 1500),
    []
  );

  // Populate search term with user selected title from autocomplete results.
  const handleAutocompleteTitleSelect = useCallback((title: string) => {
    setSearchTerm(title);
    setAutocompleteResults([]);
  }, []);

  // Fetch services matching user submitted filters and display viewing options.
  const handleTitleRowClick = useCallback(
    async (id: number) => {
      setExpandedTitleId(id);
      setWatchmodeSourceData([]);
      setFetchError(null);
      try {
        setResultsLoading(true);
        const sources = await fetchWatchmodeTitleSources(id, selectedSources, selectedAccessTypes);
        setWatchmodeSourceData(sources);
        if (sources.length === 0) {
          setFetchError("No services available for this title with your filters.");
        }
      } catch (e) {
        console.error(e);
        setFetchError("Error fetching services for this title.");
      } finally {
        setResultsLoading(false);
      }
    },
    [selectedSources, selectedAccessTypes]
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
            searchLoading={searchLoading}
            debouncedSearch={debouncedSearch}
            autocompleteResults={autocompleteResults}
            selectedSources={selectedSources}
            searchTerm={searchTerm}
            sourcesError={sourcesError}
            searchTermError={searchTermError}
            step={step}
          />
          <TitleContainer omdbData={omdbData} />
          {watchmodeTitleData && <ResultsContainer watchmodeTitleData={watchmodeTitleData} omdbData={omdbData} expandedTitleId={expandedTitleId} handleTitleRowClick={handleTitleRowClick} />}
          <ViewingOptionsContainer expandedTitleId={expandedTitleId} watchmodeSourceData={watchmodeSourceData} fetchError={fetchError} resultsLoading={resultsLoading} />
        </>
      )}
    </div>
  );
};

export default StepWrapper;
