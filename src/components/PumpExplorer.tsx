"use client";

import { useState, useMemo } from "react";
import { PumpListItem } from "@/types/pump";
import PumpCard from "./PumpCard";
import PumpModal from "./PumpModal";
import {
  Search,
  Filter,
  Users,
  Droplet,
  MapPin,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  RefreshCcw,
} from "lucide-react";

interface PumpExplorerProps {
  initialPumps: PumpListItem[];
}

export default function PumpExplorer({ initialPumps }: PumpExplorerProps) {
  const [pumps] = useState<PumpListItem[]>(initialPumps);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "people">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activePumpId, setActivePumpId] = useState<string | null>(null);

  // Extract unique areas for filter
  const areas = useMemo(() => {
    const areaSet = new Set<string>();
    pumps.forEach((p) => {
      const area = p.data.pumpLocation?.area;
      if (area && area.trim()) areaSet.add(area.trim());
    });
    return Array.from(areaSet).sort();
  }, [pumps]);

  // Filter and sort pumps
  const filteredPumps = useMemo(() => {
    let list = [...pumps];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const title = p.data.titleOfPump?.toLowerCase() || "";
        const village = p.data.pumpLocation?.village?.toLowerCase() || "";
        const area = p.data.pumpLocation?.area?.toLowerCase() || "";
        const country = p.data.pumpLocation?.country?.toLowerCase() || "";
        const id = p.id.toLowerCase();
        return (
          title.includes(q) ||
          village.includes(q) ||
          area.includes(q) ||
          country.includes(q) ||
          id.includes(q)
        );
      });
    }

    if (selectedArea !== "all") {
      list = list.filter((p) => p.data.pumpLocation?.area === selectedArea);
    }

    list.sort((a, b) => {
      if (sortBy === "newest") return (b.createdTime || 0) - (a.createdTime || 0);
      if (sortBy === "oldest") return (a.createdTime || 0) - (b.createdTime || 0);
      if (sortBy === "people") {
        const peopleA = a.data.socialInformation?.noOfPeopleServed || 0;
        const peopleB = b.data.socialInformation?.noOfPeopleServed || 0;
        return peopleB - peopleA;
      }
      return 0;
    });

    return list;
  }, [pumps, searchQuery, selectedArea, sortBy]);

  // Aggregate stats
  const totalPeopleServed = useMemo(() => {
    return filteredPumps.reduce(
      (sum, p) => sum + (p.data.socialInformation?.noOfPeopleServed || 0),
      0
    );
  }, [filteredPumps]);

  const uniqueVillages = useMemo(() => {
    const villages = new Set(
      filteredPumps
        .map((p) => p.data.pumpLocation?.village)
        .filter(Boolean)
    );
    return villages.size;
  }, [filteredPumps]);

  return (
    <div className="space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-xs dark:border-sky-950 dark:from-sky-950/30 dark:to-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-sky-600 uppercase dark:text-sky-400">
              Pumps Loaded
            </span>
            <span className="rounded-xl bg-sky-100 p-2.5 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300">
              <Droplet className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {filteredPumps.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              of {pumps.length} total
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-xs dark:border-emerald-950 dark:from-emerald-950/30 dark:to-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              People Served
            </span>
            <span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalPeopleServed.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              community members
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-xs dark:border-amber-950 dark:from-amber-950/30 dark:to-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
              Communities & Villages
            </span>
            <span className="rounded-xl bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
              <MapPin className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {uniqueVillages}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              unique villages
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Modes */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between dark:border-zinc-800 dark:bg-zinc-900">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by village, area, country, title, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-slate-50 py-2.5 pr-4 pl-11 text-sm text-slate-900 outline-hidden transition focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-zinc-800 dark:text-white dark:focus:bg-zinc-850"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Area Filter */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
            <Filter className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 outline-hidden dark:text-zinc-300"
            >
              <option value="all">All Areas ({areas.length})</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "people")
              }
              className="bg-transparent text-xs font-medium text-slate-700 outline-hidden dark:text-zinc-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="people">Most People Served</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl p-1.5 transition ${
                viewMode === "grid"
                  ? "bg-white text-sky-600 shadow-xs dark:bg-zinc-700 dark:text-sky-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-xl p-1.5 transition ${
                viewMode === "list"
                  ? "bg-white text-sky-600 shadow-xs dark:bg-zinc-700 dark:text-sky-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-zinc-500"
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pumps Display */}
      {filteredPumps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center dark:border-zinc-800">
          <Droplet className="h-12 w-12 text-slate-300 dark:text-zinc-700" />
          <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-zinc-200">
            No pumps match your search
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Try adjusting your query or resetting the area filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedArea("all");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-400"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPumps.map((pump) => (
            <PumpCard
              key={pump.id}
              pump={pump}
              onSelect={(p) => setActivePumpId(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Title / ID</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">People Served</th>
                  <th className="px-6 py-4">Recorded Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredPumps.map((pump) => (
                  <tr
                    key={pump.id}
                    className="group transition hover:bg-slate-50/50 dark:hover:bg-zinc-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-sky-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                        {pump.data.titleOfPump || "Unnamed Pump"}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                        {pump.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">
                      {[
                        pump.data.pumpLocation?.village,
                        pump.data.pumpLocation?.area,
                        pump.data.pumpLocation?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-zinc-200">
                      {pump.data.socialInformation?.noOfPeopleServed
                        ? `${pump.data.socialInformation.noOfPeopleServed.toLocaleString()} people`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-400">
                      {pump.createdTime
                        ? new Date(pump.createdTime).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActivePumpId(pump.id)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-sky-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-sky-600"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <PumpModal
        pumpId={activePumpId}
        onClose={() => setActivePumpId(null)}
      />
    </div>
  );
}
