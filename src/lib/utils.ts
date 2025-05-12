type StreamingSource = {
    source_id: number
    type: string
    [key: string]: any
  }
  
  export function groupAndSortStreamingSources(
    streamingData: StreamingSource[] | null | undefined,
    selectedTypes: string[]
  ): Record<number, StreamingSource[]> {
    if (!Array.isArray(streamingData)) return {};
  
    const grouped: Record<number, StreamingSource[]> = {};
  
    for (const entry of streamingData) {
      if (entry.region !== "US") continue;
      if (!selectedTypes.includes(entry.type)) continue;
  
      if (!grouped[entry.source_id]) {
        grouped[entry.source_id] = [];
      }
      grouped[entry.source_id].push(entry);
    }
  
    return grouped;
  }
  