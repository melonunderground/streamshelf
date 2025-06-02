import React, { useMemo } from "react";
import { Source } from "@/lib/types";

interface Props {
  expandedTitleId: number | null;
  watchmodeSourceData: Source[];
  fetchError: string | null;
  resultsLoading: boolean;
}

const ViewingOptionsContainer = ({ expandedTitleId, fetchError, watchmodeSourceData, resultsLoading }: Props) => {
  const viewingOptions = useMemo(() => {
    const typeNames: Record<string, string> = {
      sub: "Subscription",
      free: "Free",
      tve: "TV App",
      buy: "Buy",
      rent: "Rent",
    };

    return watchmodeSourceData
      .filter((s, i, arr) => arr.findIndex((x) => x.source_id === s.source_id) === i)
      .map((src) => {
        const label = typeNames[src.type] || src.type;
        const price = src.price != null ? `$${src.price}` : "—";
        return (
          <div key={src.source_id} className="border border-[#E1E3FF] bg-white rounded-lg p-4 flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold text-[#2B1A82]">{src.name}</p>
              <p className="text-xs font-medium text-[#4F67FF]">
                {label}
                {price !== "—" && ` (${price})`}
              </p>
            </div>
            <a href={src.web_url} target="_blank" rel="noopener noreferrer" className="bg-[#4F67FF] text-white py-1 px-4 rounded-lg hover:bg-[#7E69FF] transition-colors">
              Watch
            </a>
          </div>
        );
      });
  }, [watchmodeSourceData]);

  return (
    expandedTitleId !== null && (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#2B1A82]">Viewing Options</h2>

        <div className="mb-6 bg-white rounded-xl shadow-md border border-[#7E69FF] p-4 min-h-[6.5rem] max-h-72 overflow-y-auto">
          {resultsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-[#7E69FF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">{fetchError}</div>
          ) : watchmodeSourceData.length > 0 ? (
            viewingOptions
          ) : (
            <div className="flex items-center justify-center h-full text-center text-red-600 bg-red-50 p-4 rounded">No titles available for this title with your streaming services.</div>
          )}
        </div>
      </div>
    )
  );
};

export default React.memo(ViewingOptionsContainer);
