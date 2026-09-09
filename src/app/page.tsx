import { fetchPumps } from "@/lib/api";
import { PumpListItem } from "@/types/pump";
import PumpExplorer from "@/components/PumpExplorer";
import { Droplet, ExternalLink, Activity, Database } from "lucide-react";

export const revalidate = 120; // revalidate every 2 minutes

export default async function HomePage() {
  let pumps: PumpListItem[] = [];
  let errorMsg: string | null = null;

  try {
    pumps = await fetchPumps({ limit: 90, skip: 0 });
  } catch (err: any) {
    errorMsg = err?.message || "Failed to connect to GraphQL API";
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-sky-500 selection:text-white dark:bg-black dark:text-zinc-100">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white shadow-md shadow-sky-500/20">
              <Droplet className="h-5 w-5 fill-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Wells for Zoë
              </span>
              <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Pump Explorer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-xs font-medium text-emerald-700 sm:flex dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GraphQL Staging API</span>
            </div>

            <a
              href="https://wellsforzoe.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <span>wellsforzoe.org</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-white py-14 sm:py-20 dark:border-zinc-800/60 dark:bg-zinc-950">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-30 blur-3xl">
          <div className="h-72 w-[600px] bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-full" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/60 dark:text-sky-300">
              <Database className="h-3.5 w-3.5" />
              Connected via pumps_vscode.http configuration
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Clean Water Pumps Directory & Field Records
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg dark:text-zinc-400">
              Explore water pump installations, maintenance reports, community
              beneficiaries, GPS coordinates, and field photography from Malawi
              and surrounding areas.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {errorMsg ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-950 dark:bg-rose-950/30">
            <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300">
              Could not load pump records
            </h3>
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
              {errorMsg}
            </p>
          </div>
        ) : (
          <PumpExplorer initialPumps={pumps} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-sky-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Wells for Zoë Pump Explorer
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Powered by Next.js 16, React 19, Tailwind CSS, and AWS GraphQL API.
          </p>
        </div>
      </footer>
    </div>
  );
}
