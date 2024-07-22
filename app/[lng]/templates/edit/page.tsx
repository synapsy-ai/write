"use client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EditTemplatePage from "./editpage";

export default function ViewPage({ params }: { params: { lng: string } }) {
  return (
    <Suspense fallback={LoadingUI()}>
      <EditTemplatePage params={params} />
    </Suspense>
  );
}
function LoadingUI() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <p>Loading...</p>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-16 w-[240px]" />
      </div>
    </div>
  );
}
