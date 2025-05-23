import { Source, TitleAutocomplete, TitleData, TitleResult } from './types'

// Watchmode movie/tv show searches for list of valid suggested titles while user is typing.
export async function fetchWatchmodeAutocomplete(title: string): Promise<TitleAutocomplete[]> {
    const watchmodeKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY;
    const searchUrl = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${watchmodeKey}&search_type=2&search_value=${encodeURIComponent(title)}`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results;
      } else {
        return [];
      }
    
    } catch (error) {
      console.error("Error fetching autocomplete data from Watchmode:", error);
      return [];
    }
}

// OMDB movie/tv show data for image and description.
export async function fetchOmdbTitle(title: string): Promise<TitleData | null> {
    const omdbKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      console.log("OMDb Data:", data); 
      return data as TitleData; 
    } else {
      console.error("Error fetching data from OMDb:", data.Error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Watchmode movie/tv show search for any title results that match title.
export async function fetchWatchmodeTitleResults(title: string): Promise<TitleResult[] | null> {
    const watchmodeKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY;
    const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${watchmodeKey}&search_field=name&search_value=${encodeURIComponent(title)}`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data || !data.title_results || data.title_results.length === 0) {
        console.error("No result found for search term.");
        return [];
      }

      return data.title_results;
    } catch (error) {
      console.error("Error fetching data from Watchmode:", error);
      return [];
    }
}

// Watchmode movie/tv selected from title results to display titles sources matching user selected sources and access types.
export async function fetchWatchmodeTitleSources(titleId: number, selectedSources: number[], selectedAccessTypes: string[]): Promise<Source[]> {
  const watchmodeKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY;
  // Url for titleId.
  const sourcesUrl = `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${watchmodeKey}`;

  try {
    const response = await fetch(sourcesUrl);
    const data = await response.json();
    console.log(data);
  
    if (!data || data.length === 0) {
      console.error("No results found for the search term.");
      return [];
    }

    // Chaining filters to filter by region, selected access types, and selected sources
    const filteredSources = data
    .filter((source: { region: string; }) => source.region === "US")
    .filter((source: {type: string }) => selectedAccessTypes.includes(source.type))
    .filter((source: {source_id: number}) => selectedSources.includes(source.source_id))
    console.log("Filtered Sources",filteredSources);
    return filteredSources as Source[];
  } catch (error) {
    console.error("Error fetching data from Watchmode:", error);
    return [];
  }
}


 
