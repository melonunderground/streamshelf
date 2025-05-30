import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.trim()
  if (!title) {
    return NextResponse.json({ error: 'Missing `title`' }, { status: 400 })
  }

  const apiKey = process.env.WATCHMODE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'WATCHMODE_API_KEY not set' }, { status: 500 })
  }

  try {
    const { data } = await axios.get('https://api.watchmode.com/v1/search/', {
      params: {
        apiKey,
        search_field: 'name',
        search_value: title,
      },
    })
    // Cache data 7 days, stale 1 hour on revalidate.
    return NextResponse.json(data.title_results || [], {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=3600', // 7 days cache, 1 hour revalidation
      },
    })
  } catch (err) {
    console.error('Watchmode title search error', err)
    return NextResponse.json([], { status: 502 })
  }
}
