"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-gray-800 border-b border-gray-700 shadow-md">
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          AI
        </div>
        <h1 className="text-xl font-semibold text-indigo-400">
          Interview Analyzer
        </h1>
      </div>

      {/* Right side (logout button etc.) */}
      <div>
        <Button
          variant="secondary"
          className="bg-gray-600 hover:bg-gray-500 text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
