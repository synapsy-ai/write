"use client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ViewTemplatePage from "./viewpage";
import { DefaultLanguageParams } from "@/lib/languages";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={LoadingUI()}>
      <ViewTemplatePage params={params} />
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
