// src/app/page.tsx
import SearchClient from "@/components/SearchClient"

export default function HomePage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎬 Stream Shelf</h1>
      <SearchClient />
    </main>
  )
}
