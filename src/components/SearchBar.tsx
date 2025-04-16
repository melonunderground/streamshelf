// "use client"

// import { useState } from "react"

// interface SearchBarProps {
//   onSearch: (query: string) => void
// }

// const SearchBar = ({ onSearch }: SearchBarProps) => {
//   const [query, setQuery] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (query.trim()) {
//       onSearch(query)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex justify-center gap-4">
//       <input
//         type="text"
//         placeholder="Search movies or shows..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         className="w-full md:w-1/2 p-2 border rounded shadow-sm"
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Search
//       </button>
//     </form>
//   )
// }

// export default SearchBar
