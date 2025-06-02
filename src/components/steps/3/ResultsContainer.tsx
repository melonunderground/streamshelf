"use client";

import React from "react";
import { TitleData, TitleResult } from "@/lib/types";

interface Props {
  watchmodeTitleData: TitleResult[];
  omdbData: TitleData | null;
  expandedTitleId: number | null;
  handleTitleRowClick: (id: number) => void;
}

const ResultsContainer = ({ watchmodeTitleData, omdbData, expandedTitleId, handleTitleRowClick }: Props) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#2B1A82]">Matching Results (Select One)</h2>

      <div className="overflow-y-auto max-h-80  mb-6 rounded-lg shadow-sm border border-[#7E69FF]">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-[#4F67FF]">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium uppercase text-white">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {watchmodeTitleData.map((t, index) => {
              const isActive = expandedTitleId === t.id;
              const isDefaultMatch = expandedTitleId === null && omdbData?.imdbID && t.imdb_id === omdbData.imdbID;
              const isHighlighted = isActive || isDefaultMatch;
              return (
                <tr key={t.id} onClick={() => handleTitleRowClick(t.id)} className={`cursor-pointer transition-colors duration-150 ${index % 2 === 0 ? "bg-[#F0F2FF]" : ""} hover:bg-[#D8DAFE] ${isHighlighted ? "bg-[#D8DAFE] font-bold" : ""}`}>
                  <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82]">{isHighlighted ? <strong>{t.name}</strong> : t.name}</td>
                  <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82]">{t.year}</td>
                  <td className="border-b border-[#E1E3FF] px-4 py-2 text-[#2B1A82] capitalize">{t.type.replace(/_/g, " ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ResultsContainer);
