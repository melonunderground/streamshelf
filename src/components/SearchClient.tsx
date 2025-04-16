"use client"

import { useEffect, useState } from "react"
import { fetchOmdbData, fetchStreamingInfo, fetchAllSources } from "@/lib/api"
import { groupAndSortStreamingSources } from "@/lib/utils"
// import SearchBar from "./SearchBar"

const SearchClient = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['sub']);
  const [movieData, setMovieData] = useState<any>(null)
  const [streamingData, setStreamingData] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSources() {
      try {
        const data = await fetchAllSources()
        setSources(data)
      } catch (err) {
        console.error("Error fetching sources", err)
      }
    }

    loadSources()
  }, [])

  const handleSourceChange = (id: number) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const groupedSources = groupAndSortStreamingSources(streamingData)

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError(null)

    try {
      const movie = await fetchOmdbData(query)
      setMovieData(movie)

      const platforms = [203, 26, 372] // Netflix, Hulu, Disney+ (example)
      const streams = await fetchStreamingInfo(title, selectedSources, selectedTypes)
      setStreamingData(streams)
    } catch (err: any) {
        setError(err.message || "Search failed")
      } finally {
        setLoading(false)
      }
    }

  return (
    <>
      {/* <SearchBar onSearch={handleSearch} /> */}

      <div className="space-y-6">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Search for a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={() => {handleSearch(title)}} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button> 

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      <div>
        <h2 className="text-lg font-semibold">Streaming Sources</h2>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {sources.map(source => (
            <label key={source.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={source.id}
                checked={selectedSources.includes(source.id)}
                onChange={() => handleSourceChange(source.id)}
              />
              {source.name}
            </label>
          ))}
        </div>

        <h2 className="text-lg font-semibold mt-4">Content Types</h2>
        <div className="flex gap-4 flex-wrap">
          {["sub", "free", "purchase", "tve"].map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        {results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-6">Results</h3>
            <ul className="space-y-2">
              {results.map((result, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <div>{result.name} - {result.type}</div>
                  <div>{result.region}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

      {loading && <p className="text-center mt-6">🔄 Loading...</p>}

      {movieData && (
        <div className="mt-6 p-4 border rounded shadow">
          <h2 className="text-2xl font-bold">{movieData.Title}</h2>
          <p className="text-gray-700 mb-2">{movieData.Plot}</p>
          <p className="text-sm">IMDb Rating: {movieData.imdbRating}</p>
        </div>
      )}



      {streamingData?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Streaming availability:</h3>
{Object.entries(groupedSources).map(([sourceId, sourceList]) => (
  <div key={sourceId} className="mb-4">
    <h3 className="text-lg font-semibold">{sourceList[0].name}</h3>
    <ul className="ml-4 list-disc">
      {sourceList.map((entry, index) => (
        <li key={`${entry.source_id}-${entry.type}-${index}`}>
          <span className="capitalize">{entry.type}</span>{' '}
          — <a href={entry.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{entry.region || "Global"}</a>
        </li>
      ))}
    </ul>
  </div>
))}

        </div>
      )}
    </>
  )
}

export default SearchClient
