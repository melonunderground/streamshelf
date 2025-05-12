import React, { useState, useRef, useEffect } from "react";
import { WatchmodeSource } from "@/lib/types";

interface StreamingSourcesSelectorProps {
  sources: WatchmodeSource[];
  selectedSourceIds: number[];
  setSelectedSourceIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const StreamingSourcesSelector: React.FC<StreamingSourcesSelectorProps> = ({
  sources,
  selectedSourceIds,
  setSelectedSourceIds,
}) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleSource = (id: number) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      modalRef.current &&
      !modalRef.current.contains(target) &&
      !(target as HTMLElement).closest("button")
    ) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const selectedSources = selectedSourceIds
    // filter for US region
    .map((id) => sources.find((s) => s.id === id && s.regions.includes("US")))
    .filter((s): s is WatchmodeSource => Boolean(s));

  return (
    <div>
      <div>
        {selectedSources.map((source, index) => (
          <div
            key={`selected-${source.id}`}
            onClick={() => toggleSource(source.id)}
            className={`p-3 rounded-md cursor-pointer transition hover:bg-gray-100 ${
              selectedSourceIds.includes(source.id)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            {<span>{source.name}</span>}
          </div>
        ))}

        <button onClick={() => setShowModal((prev) => !prev)}>View More</button>
      </div>
      <div>
        {showModal && (
          <div ref={modalRef}>
            <button onClick={() => setShowModal(false)}>✕</button>
            <h2>All Streaming Sources</h2>
            <div className="grid grid-rows">
              {sources.map((source) => (
                <div
                  key={`modal-${source.id}`}
                  onClick={() => toggleSource(source.id)}
                  className={`p-3 rounded-md cursor-pointer transition hover:bg-gray-100 ${
                    selectedSourceIds.includes(source.id)
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span>{source.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingSourcesSelector;
