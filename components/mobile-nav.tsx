import { Home, List, Pen, Settings } from "lucide-react";
import Link from "next/link";

export default function MobileNavBar(props: { lng: string }) {
  return (
    <div className="fixed bottom-0 z-50 block w-full sm:hidden">
      <nav className="grid grid-cols-3 items-center rounded-t-md bg-white/50 shadow-[0px_-5px_20px_1px_#00000012] backdrop-blur-md dark:bg-slate-900/50">
        <Link
          className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-white hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25"
          href={"/" + props.lng + "/generations"}
        >
          <List />
        </Link>
        <div className="flex justify-center">
          <Link
            className="group flex w-16 -translate-y-2 items-center justify-center rounded-full border border-violet-400 bg-gradient-to-r from-violet-500 to-indigo-500 p-5 shadow-md shadow-violet-500/50 hover:from-violet-500 hover:to-violet-500"
            href={"/" + props.lng + "/create"}
          >
            <Pen
              className="transition-all ease-in-out group-hover:scale-125"
              color="white"
            />
          </Link>
        </div>
        <Link
          className="flex items-center justify-center rounded-md border border-transparent p-5 hover:border-white hover:bg-slate-100/25 dark:hover:border-slate-700 dark:hover:bg-slate-800/25"
          href={"/" + props.lng + "/settings"}
        >
          <Settings />
        </Link>
      </nav>
    </div>
  );
}
