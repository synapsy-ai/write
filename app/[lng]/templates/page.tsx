"use client";
import { Suspense } from "react";
import { DefaultLanguageParams } from "@/lib/languages";
import LoadingUI from "@/components/loading";
import TemplatesPage from "./templatepage";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={<LoadingUI />}>
      <TemplatesPage params={params} />
    </Suspense>
  );
}
