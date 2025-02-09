"use client";
import { Suspense } from "react";
import GenerationsPage from "./genpage";
import { DefaultLanguageParams } from "@/lib/languages";
import LoadingUI from "@/components/loading";

export default function ViewPage({
  params,
}: {
  params: DefaultLanguageParams;
}) {
  return (
    <Suspense fallback={<LoadingUI />}>
      <GenerationsPage params={params} />
    </Suspense>
  );
}
