import {
  Source,
  TitleAutocomplete,
  TitleData,
  TitleResult,
} from './types'

export async function fetchWatchmodeAutocomplete(
  title: string
): Promise<TitleAutocomplete[]> {
  const url = `/api/watchmode/autocomplete?title=${encodeURIComponent(title)}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(
        `Watchmode autocomplete error (${res.status}): ${res.statusText}`
      )
      return []
    }
    const data = (await res.json()) as unknown
    return Array.isArray(data) ? (data as TitleAutocomplete[]) : []
  } catch (err) {
    console.error('Network error fetching Watchmode autocomplete:', err)
    return []
  }
}

export async function fetchOmdbTitle(
  title: string
): Promise<TitleData | null> {
  const url = `/api/omdb/title?title=${encodeURIComponent(title)}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`OMDb fetch error (${res.status}): ${res.statusText}`)
      return null
    }
    const data = (await res.json()) as unknown
    return data ? (data as TitleData) : null
  } catch (err) {
    console.error('Network error fetching OMDb title:', err)
    return null
  }
}

export async function fetchWatchmodeTitleResults(
  title: string
): Promise<TitleResult[]> {
  const url = `/api/watchmode/search?title=${encodeURIComponent(title)}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`Watchmode search error (${res.status}): ${res.statusText}`)
      return []
    }
    const data = (await res.json()) as unknown
    return Array.isArray(data) ? (data as TitleResult[]) : []
  } catch (err) {
    console.error('Network error fetching Watchmode title results:', err)
    return []
  }
}

export async function fetchWatchmodeTitleSources(
  titleId: number,
  selectedSources: number[],
  selectedAccessTypes: string[]
): Promise<Source[]> {
  const params = new URLSearchParams({
    selectedSources: selectedSources.join(','),
    selectedAccessTypes: selectedAccessTypes.join(','),
  })
  const url = `/api/watchmode/title/${titleId}/sources?${params}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(
        `Watchmode title sources error (${res.status}): ${res.statusText}`
      )
      return []
    }
    const data = (await res.json()) as unknown
    return Array.isArray(data) ? (data as Source[]) : []
  } catch (err) {
    console.error('Network error fetching Watchmode title sources:', err)
    return []
  }
}



 
