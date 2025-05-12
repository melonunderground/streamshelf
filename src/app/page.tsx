// src/app/page.tsx
import StepWizard from "@/components/StepWizard";
import streamingShelfIcon from "../assets/bookshelfWithDisney.png";
import Image from "next/image";
import { accessTypes, sources } from "../lib/types";

export default function HomePage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <Image
          src={streamingShelfIcon}
          style={{ height: 300, width: 200 }}
          alt="Streaming Shelf Icon"
          priority={true}
        />
      </h1>
      <StepWizard accessTypes={accessTypes} sources={sources} />
    </main>
  );
}
