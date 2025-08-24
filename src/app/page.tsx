"use client";

import { MouseEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { extractMonoAudio } from "@/lib/audio";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/transcript";
import { getAnalysisFromTranscript, parseAnalysisJSON } from "@/lib/analysis";

import UploadCard from "@/components/UploadCard";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function handleUpload(e: MouseEvent<HTMLButtonElement>) {
    if (currentPhase !== null) return;
    e.preventDefault();

    try {
      if (!selectedFile) {
        toast.error("No file selected");
        return;
      }

      setCurrentPhase("Processing File");
      // Separate the video and audio
      const audioTrack = await extractMonoAudio(selectedFile);
      // Get audio transcript

      setCurrentPhase("Transcribing Audio Track");
      const transcript = await transcribeAudio(audioTrack);
      if (!transcript) {
        toast.error(
          "Failed to get transcript for the audio. Please try again."
        );
        return;
      }
      // Get analysis from transcript
      setCurrentPhase("Analyzing Transcript");
      const analysis_text = await getAnalysisFromTranscript(transcript);
      if (!analysis_text) {
        toast.error("Failed to get analysis for the audio. Please try again.");
        return;
      }

      const parsed_analysis = parseAnalysisJSON(analysis_text);

      localStorage.setItem(
        "interview:analysis",
        JSON.stringify(parsed_analysis)
      );
      router.push("/analysis");
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentPhase(null);
    }
  }

  function handleReset(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setSelectedFile(null);
    setCurrentPhase(null);

    // TODO: Reset the selected file via ref
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <div className=" font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-900 text-gray-100">
      {/* Upload Section */}
      <UploadCard
        fileRef={fileRef}
        onFileChange={setSelectedFile}
        onUpload={handleUpload}
        onReset={handleReset}
        disabled={currentPhase !== null}
      />

      {/* Loading Phase */}
      {currentPhase && (
        <div className="inline-flex items-center gap-4 p-3 mx-auto">
          <span className="animate-spin w-6 h-6 border-2 border-indigo-400 border-r-transparent rounded-full"></span>
          <span className="capitalize text-2xl text-indigo-300">
            {currentPhase}
          </span>
        </div>
      )}

      {/* Analysis Results */}
      {/* {analysis && <AnalysisCard analysis={analysis} />} */}

      <Toaster />
    </div>
  );
}
