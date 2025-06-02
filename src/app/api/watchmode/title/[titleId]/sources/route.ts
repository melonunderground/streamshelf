import { NextResponse } from 'next/server';
import axios from 'axios';
import { Source } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ titleId: string }> }
) {
  const { titleId: rawId } = await params;
  const titleId = parseInt(rawId, 10);
  if (isNaN(titleId)) {
    return NextResponse.json({ error: 'Invalid titleId' }, { status: 400 });
  };

  const sp = new URL(request.url).searchParams;
  const selectedSources = (sp.get('selectedSources') ?? '')
    .split(',')
    .filter(Boolean)
    .map(Number);
  const selectedAccessTypes = (sp.get('selectedAccessTypes') ?? '')
    .split(',')
    .filter(Boolean);

  const apiKey = process.env.WATCHMODE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'WATCHMODE_API_KEY not set' }, { status: 500 });
  };

  try {
    const resp = await axios.get<Source[]>(
      `https://api.watchmode.com/v1/title/${titleId}/sources/`,
      { params: { apiKey } }
    )
    const data = resp.data;

    const filtered = data
      .filter((s) => s.region === 'US')
      .filter((s) => selectedAccessTypes.includes(s.type))
      .filter((s) => selectedSources.includes(s.source_id));
    // Cache data 7 days, stale 1 hour on revalidate.
    return NextResponse.json(filtered, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error('Watchmode title sources error', err);
    return NextResponse.json([], { status: 502 });
  };
};
