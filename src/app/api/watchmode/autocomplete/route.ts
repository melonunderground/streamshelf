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
    const { data } = await axios.get(
      'https://api.watchmode.com/v1/autocomplete-search/',
      {
        params: {
          apiKey,
          search_type: 2,
          search_value: title,
        },
      }
    )
    return NextResponse.json(data.results || [])
  } catch (err) {
    console.error('Watchmode autocomplete error', err)
    return NextResponse.json([], { status: 502 })
  }
}
