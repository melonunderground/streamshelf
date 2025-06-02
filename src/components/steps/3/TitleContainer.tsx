"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import missingImage from "../../../assets/noImage.png";
import { TitleData } from "@/lib/types";

interface Props {
  omdbData: TitleData | null;
}

const TitleContainer = ({ omdbData }: Props) => {
  const [posterSrc, setPosterSrc] = useState(omdbData?.Poster || missingImage.src);

  useEffect(() => {
    setPosterSrc(omdbData?.Poster || missingImage.src);
  }, [omdbData]);

  if (!omdbData) return null;

  return (
    <div className="mb-6 bg-white rounded-xl shadow-md border border-[#7E69FF] p-6 flex gap-6">
      <div className="realtive w-32 flex-shrink-0 rounded-lg shadow-sm border border-[#E1E3FF] overflow-hidden">
        <Image src={posterSrc} alt={omdbData.Title} width={128} height={192} className="object-cover" onError={() => setPosterSrc(missingImage.src)} unoptimized />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2 text-[#2B1A82]">
          {omdbData.Title} <span className="text-[#7E69FF]">({omdbData.Year})</span>
        </h1>
        <p className="text-[#2B1A82]">{omdbData.Plot}</p>
      </div>
    </div>
  );
};
export default React.memo(TitleContainer);
