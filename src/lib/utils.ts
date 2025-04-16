type StreamingSource = {
    source_id: number
    type: string
    [key: string]: any
  }
  
  export function groupAndSortStreamingSources(
    streamingData: StreamingSource[] | null | undefined
  ): Record<number, StreamingSource[]> {
    if (!Array.isArray(streamingData)) return {}
  
    const typeOrder = ['sub', 'free', 'purchase', 'tve']
  
    const grouped = streamingData.reduce((acc, item) => {
      const key = item.source_id
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as Record<number, StreamingSource[]>)
  
    for (const key in grouped) {
      grouped[key] = grouped[key].sort(
        (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
      )
    }
  
    return grouped
  }
  