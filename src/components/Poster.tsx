import { useState } from "react";
import Image from "next/image";

interface PosterProps {
  posterUrl: string;
  title: string;
  missingImage: {
    src: string;
  };
}

export function Poster({ posterUrl, title, missingImage }: PosterProps) {
  const [src, setSrc] = useState(posterUrl);

  return (
    <div className="realtive w-32 flex-shrink-0 rounded-lg shadow-sm border border-[#E1E3FF] overflow-hidden">
      <Image src={src} alt={title} width={128} height={192} className="object-cover" onError={() => setSrc(missingImage.src)} unoptimized />
    </div>
  );
}

export default Poster;
