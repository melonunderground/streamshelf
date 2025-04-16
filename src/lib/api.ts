export async function fetchAllSources() {
    const watchmodeKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY
    const url = `https://api.watchmode.com/v1/sources/?apiKey=${watchmodeKey}`
    
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch sources")
  
    return res.json()
  }
  
export async function fetchOmdbData(title: string) {
    const omdbKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`
  
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch OMDb data")
  
    return res.json()
  }
  
  export async function fetchStreamingInfo(title: string, sourceIds: number[], selectedTypes: string[]) {
    const watchmodeKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY
    const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${watchmodeKey}&search_field=name&search_value=${encodeURIComponent(title)}`
    
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) throw new Error("Failed to search Watchmode")
  
    const { title_results } = await searchRes.json()
    const result = title_results[0]
    if (!result) throw new Error("No title found")
  
    const sourcesUrl = `https://api.watchmode.com/v1/title/${result.id}/sources/?apiKey=${watchmodeKey}`
    const sourcesRes = await fetch(sourcesUrl)
    if (!sourcesRes.ok) throw new Error("Failed to fetch sources")
  
    const allSources = await sourcesRes.json()
  
    return allSources.filter((s: any) => {
      return (
        sourceIds.includes(s.source_id) &&
        selectedTypes.includes(s.type) &&
        (!s.region || s.region === "US")
      )
    })
  }
  
  