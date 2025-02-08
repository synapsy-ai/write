"use client";
import { Loader2 } from "lucide-react";

export default function LoadingUI() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-violet-600" />
      <h2 className="text-xl font-bold">Loading...</h2>
      <div></div>
    </div>
  );
}
