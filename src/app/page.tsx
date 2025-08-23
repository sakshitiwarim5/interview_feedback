"use client";

import { MouseEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { extractMonoAudio } from "@/lib/audio";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/transcript";
import { getAnalysisFromTranscript } from "@/lib/analysis";

type Analysis = {
  recruiter: {
    areas_missed: string;
    potential_missed_questions: string;
  };
  attendee: {
    what_went_well: string;
    what_to_improve: string;
    actionable_tips: string;
  };
};
export default function Home() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }
    console.log("starting analysis");

    // Separate the video and audio
    const audioTrack = await extractMonoAudio(selectedFile);
    toast.success("audio track extracted");
    console.log(audioTrack);
    // Get audio transcript
    const transcript = await transcribeAudio(audioTrack);
    toast.success("transcript extracted");
    console.log(transcript);
    // Get analysis from transcript
    const analysis = await getAnalysisFromTranscript(transcript);
    toast.success("analysis extracted");
    console.log(analysis);
    // Update the analysis document
  }

  function handleReset(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setSelectedFile(null);
    setAnalysis(null);

    // TODO: Reset the selected file via ref
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Card>
        <CardHeader>
          <span className="font-medium text-lg">Upload Video</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-start">
            <Input
              ref={fileRef}
              placeholder="Upload Interview Video"
              id="video"
              type="file"
              // accept="*.webm,*.m4a"
              accept=".webm,.m4a,.mp3,.wav"
              onChange={(e) => {
                setSelectedFile(e.target.files?.item(0) ?? null);
              }}
            />
            <div className="flex gap-4 items-center justify-center">
              <Button onClick={handleUpload} variant="default">
                Upload
              </Button>
              <Button onClick={handleReset} variant="secondary">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {analysis && (
        <Card className="mt-6 w-full max-w-2xl">
          <CardHeader>
            <span className="font-medium text-lg">Analysis Results</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recruiter Section */}
              <div>
                <h3 className="font-semibold text-md mb-2">
                  Recruiter Feedback
                </h3>
                <p>
                  <strong>Areas Missed:</strong>{" "}
                  {analysis.recruiter.areas_missed}
                </p>
                <p>
                  <strong>Potential Questions:</strong>{" "}
                  {analysis.recruiter.potential_missed_questions}
                </p>
              </div>

              {/* Attendee Section */}
              <div>
                <h3 className="font-semibold text-md mb-2">
                  Attendee Feedback
                </h3>
                <p>
                  <strong>What Went Well:</strong>{" "}
                  {analysis.attendee.what_went_well}
                </p>
                <p>
                  <strong>To Improve:</strong>{" "}
                  {analysis.attendee.what_to_improve}
                </p>
                <p>
                  <strong>Actionable Tips:</strong>{" "}
                  {analysis.attendee.actionable_tips}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  );
}
