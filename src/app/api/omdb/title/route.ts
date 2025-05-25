import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')?.trim()
  if (!title) {
    return NextResponse.json({ error: 'Missing `title`' }, { status: 400 })
  }

  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OMDB_API_KEY not set' }, { status: 500 })
  }

  try {
    const { data } = await axios.get('https://www.omdbapi.com/', {
      params: { apikey: apiKey, t: title },
    })
    if (data.Response === 'True') {
      return NextResponse.json(data)
    }
    return NextResponse.json(null, { status: 404 })
  } catch (err) {
    console.error('OMDb lookup error', err)
    return NextResponse.json(null, { status: 502 })
  }
}
