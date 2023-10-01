"use client";
export default function GenerationViewPage({
  params,
}: {
  params: { id: string; lng: string };
}) {
  const id = (params.id as string) ?? 0;
  function getContent() {
    if (typeof window !== "undefined") {
      return (
        <p id="contentp">
          {
            JSON.parse(localStorage.getItem("rativegen_write_history") ?? "[]")[
              id
            ].content
          }
        </p>
      );
    }
    return <p>Error</p>;
  }
  return (
    <main>
      <section className="flex flex-col items-center justify-center">
        <section
          className="m-2 rounded-md p-4 text-justify shadow-lg dark:bg-slate-900 print:text-black print:shadow-none md:w-[90%] lg:w-[60%] xl:w-[50%]"
          id="ct"
        >
          {getContent()}
        </section>
      </section>
    </main>
  );
}
