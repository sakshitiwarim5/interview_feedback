"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalysisCard from "@/components/AnalysisCard";
import type { Analysis } from "@/components/AnalysisCard";

export default function AnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    try {
      const str = localStorage.getItem("interview:analysis");
      if (str) {
        setAnalysis(JSON.parse(str));
      }
    } catch {
      setAnalysis(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-900 flex flex-col text-gray-200">
      {/* Main Content */}
      <main className="flex-grow px-6 py-8 overflow-auto">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Page Title */}

          {/* Analysis Card */}
          {analysis ? (
            <AnalysisCard analysis={analysis} />
          ) : (
            <div>No Analysis Found.</div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <Button
              onClick={() => router.push("/")}
              variant="secondary"
              className="flex items-center gap-2 px-6 py-3 text-lg"
            >
              <RefreshCcw className="w-5 h-5" /> Try Again
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
