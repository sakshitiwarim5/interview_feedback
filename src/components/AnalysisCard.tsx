"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, User } from "lucide-react";

export type Analysis = {
  recruiter: {
    areas_missed: string;
    potential_missed_questions: string;
  };
  attendee: {
    what_went_well: string;
    what_to_improve: string;
    actionable_tip: string;
  };
};

type AnalysisCardProps = {
  analysis: Analysis;
};

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Card className="mt-8 w-full max-w-[90rem] mx-auto bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-white">
          Interview Analysis Results
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recruiter Feedback */}
          <div className="p-6 rounded-2xl bg-gray-800/80 backdrop-blur-md border border-indigo-500/30 shadow-lg hover:scale-[1.02] transition transform">
            <h3 className="flex items-center gap-2 text-indigo-400 text-xl font-semibold">
              <Briefcase className="w-6 h-6 text-indigo-400" /> Recruiter
              Feedback
            </h3>
            <ol className="mt-4 space-y-3 text-gray-300 list-decimal list-inside">
              <li>
                <strong>Areas Missed:</strong> {analysis.recruiter.areas_missed}
              </li>
              <li>
                <strong>Potential Questions:</strong>{" "}
                {analysis.recruiter.potential_missed_questions}
              </li>
            </ol>
          </div>

          {/* Attendee Feedback */}
          <div className="p-6 rounded-2xl bg-gray-800/80 backdrop-blur-md border border-pink-500/30 shadow-lg hover:scale-[1.02] transition transform">
            <h3 className="flex items-center gap-2 text-pink-400 text-xl font-semibold">
              <User className="w-6 h-6 text-pink-400" /> Attendee Feedback
            </h3>
            <ol className="mt-4 space-y-3 text-gray-300 list-decimal list-inside">
              <li>
                <strong>What Went Well:</strong>{" "}
                {analysis.attendee.what_went_well}
              </li>
              <li>
                <strong>To Improve:</strong> {analysis.attendee.what_to_improve}
              </li>
              <li>
                <strong>Actionable Tip:</strong>{" "}
                {analysis.attendee.actionable_tip}
              </li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
