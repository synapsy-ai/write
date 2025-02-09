"use client";
import { Suspense } from "react";
import GenerationViewPage from "./viewpage";
import { DefaultLanguageParams } from "@/lib/languages";
import LoadingUI from "@/components/loading";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={<LoadingUI />}>
      <GenerationViewPage params={params} />
    </Suspense>
  );
}
