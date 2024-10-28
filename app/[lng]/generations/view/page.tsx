"use client";
import { Suspense } from "react";
import GenerationViewPage from "./viewpage";
import { Skeleton } from "@/components/ui/skeleton";
import { DefaultLanguageParams } from "@/lib/languages";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={LoadingUI()}>
      <GenerationViewPage params={params} />
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
