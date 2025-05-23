// src/app/page.tsx
import StepWizard from "@/components/StepWizard";
import streamingShelfIcon from "../assets/bookshelfWithDisney.png";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fuchsia-100 container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-0">
        <Image src={streamingShelfIcon} height={250} alt="Streaming Shelf Icon" priority className="block mx-auto" />
      </h1>
      <StepWizard />
    </main>
  );
}
