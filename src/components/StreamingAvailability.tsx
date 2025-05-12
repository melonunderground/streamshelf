import React from "react";

interface StreamingEntry {
  source_id: number;
  type: string;
  web_url: string;
  region?: string;
  name?: string;
  logo_100px?: string;
}

interface SourceMeta {
  id: number;
  name: string;
  logo_100px?: string;
}

interface StreamingAvailabilityProps {
  groupedSources: Record<string, StreamingEntry[]>;
  sources: SourceMeta[];
}

const StreamingAvailability: React.FC<StreamingAvailabilityProps> = ({
  groupedSources,
  sources,
}) => {
  console.log("groupedSources", groupedSources);
  console.log("sources", sources);
  return (
    <div className="mt-6 px-4 w-full max-w-xl mx-auto text-center">
      <h3 className="text-lg font-semibold mb-4">Streaming Availability</h3>
      {Object.entries(groupedSources).map(([sourceId, entries]) => {
        console.log("Grouped Sources Keys:", Object.keys(groupedSources));
        console.log(
          "Grouped Sources Sample:",
          groupedSources[Object.keys(groupedSources)[0]]
        );
        const sourceMeta = sources.find((s) => s.id === Number(sourceId));
        if (!sourceMeta) return null;

        return (
          <div key={sourceId} className="mb-4">
            <h4 className="flex items-center justify-center gap-2 text-md font-semibold text-blue-700 mb-1">
              {sourceMeta.name}
            </h4>
            <ul className="list-disc list-inside text-left inline-block">
              {entries.map((entry, index) => (
                <li key={`${entry.source_id}-${entry.type}-${index}`}>
                  <span className="capitalize">{entry.type}</span> —{" "}
                  <a
                    href={entry.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {entry.region || "Global"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default StreamingAvailability;
