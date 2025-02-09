"use client";
import { Suspense } from "react";
import GenerationEditPage from "./editpage";
import { DefaultLanguageParams } from "@/lib/languages";
import LoadingUI from "@/components/loading";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={<LoadingUI />}>
      <GenerationEditPage params={params} />
    </Suspense>
  );
}
