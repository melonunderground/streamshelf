export type AccessLabel = 'Included' | 'All'

export const accessChoices: Record<AccessLabel, string[]> = {
  Included: ['sub', 'free', 'tve'],
  All: ['buy', 'rent'],
}

export const steps = [
  [1, "Access"],
  [2, "Services"],
  [3, "Search"],
] as const;

export type StepTuple = typeof steps[number];
export type StepKey = StepTuple[0];
export type StepValue = StepTuple[1];


interface Rating {
  Source: string;
  Value: string;
}

export interface TitleData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  Response: string;
}

export interface TitleResult {
  id: number;
  imdb_id: string;
  name: string;
  resultType: string;
  tmdb_id: number;
  tmdb_type: string;
  type: string;
  year: number;
}

export interface TitleAutocomplete {
  name: string;
  relevance: number;
  type: string;
  id: number;
  year: number;
  result_type: string;
  tmdb_id: number;
  tmdb_type: string;
  image_url: string;
}

export interface Source {
  android_url: string;
  episodes: number;
  format: string;
  ios_url: string;
  name: string;
  price: number | null;
  region: string;
  seasons: number;
  source_id: number;
  type: string;
  web_url: string;
}


