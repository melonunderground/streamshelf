export interface WatchmodeSource {
  id: number;
  name: string;
  type: string | null;
  logo_100px: string;
  ios_appstore_url: string | null;
  android_playstore_url: string | null;
  android_scheme: string | null;
  ios_scheme: string | null;
  regions: string[];
}
  
  export interface StreamingEntry {
    source_id: number;
    name: string;
    type: string;
    web_url: string;
    region?: string;
    // ...any other Watchmode streaming info fields
  }
  
  export interface OmdbTitle {
    Title: string;
    Year: string;
    Plot: string;
    imdbRating: string;
    Poster?: string;
    Ratings?: {
      Source: string;
      Value: string;
    }[];
  }
  
  export type StreamingData = StreamingEntry[];
  
  export type GroupedStreamingSources = Record<string, StreamingEntry[]>;
  
  export const accessTypes = {
    "Subscription Included": "sub",
    "Free to Watch": "free",
    "Rent or Buy": "purchase",
    "TV Channel App": "tve",
  };
  
