

"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MouseEvent, RefObject } from "react";
import { motion } from "framer-motion";
import { Hand, Upload, RotateCcw } from "lucide-react"; // ✅ Icons added

type UploadCardProps = {
  fileRef: RefObject<HTMLInputElement | null>;
  onFileChange: (file: File | null) => void;
  onUpload: (e: MouseEvent<HTMLButtonElement>) => void;
  onReset: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
};

export default function UploadCard({
  fileRef,
  onFileChange,
  onUpload,
  onReset,
  disabled,
}: UploadCardProps) {
  return (
    <motion.div
      className="w-full flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Greeting / Thought */}
      <div className="text-center max-w-2xl">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-white mb-3">
          <Hand className="w-8 h-8 text-white" />
          Hi, let’s analyze your interview!
        </h2>
        <p className="text-gray-400 text-lg">
          Upload your interview recording and get instant, AI-powered feedback
          from both recruiter and attendee perspectives.
        </p>
      </div>

      {/* Upload Card */}
      <Card className="bg-gray-800/90 border border-gray-700 shadow-2xl rounded-2xl w-full max-w-3xl backdrop-blur-sm">
        <CardHeader>
          <span className="font-semibold text-xl text-indigo-400">
            Upload Interview Video / Audio
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 items-center justify-center">
            {/* Drag & Drop Zone */}
            <label
              htmlFor="video"
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-8 cursor-pointer hover:border-indigo-500 hover:bg-gray-700/40 transition-colors"
            >
              <p className="text-gray-300 mb-2">
                Drag & drop your file here, or click to browse
              </p>
              <Input
                ref={fileRef}
                id="video"
                type="file"
                accept=".webm,.m4a,.mp3,.wav"
                onChange={(e) => {
                  onFileChange(e.target.files?.item(0) ?? null);
                }}
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                Supported formats: webm, m4a, mp3, wav
              </span>
            </label>

            {/* Centered buttons */}
            <div className="flex gap-6 justify-center mt-4">
             
              <Button
                onClick={(e) => {
                  onUpload(e);
                }}
                variant="default"
                disabled={disabled}
                className="flex items-center gap-2 px-10 py-3 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload
              </Button>
              <Button
                onClick={onReset}
                variant="secondary"
                className="flex items-center gap-2 px-10 py-3 text-lg font-medium bg-gray-600 hover:bg-gray-500 text-white rounded-xl shadow-md"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
