"use client";

import Image from "next/image";
import Link from "next/link";
import { PumpListItem } from "@/types/pump";
import { MapPin, Users, Calendar, ArrowRight, Droplets, ImageOff } from "lucide-react";
import { useState } from "react";

interface PumpCardProps {
  pump: PumpListItem;
  onSelect?: (pump: PumpListItem) => void;
}

export default function PumpCard({ pump, onSelect }: PumpCardProps) {
  const [imgError, setImgError] = useState(false);
  const data = pump.data;
  const title = data.titleOfPump || "Unnamed Pump Installation";
  const photos = data.referencedPhotos || [];
  const mainPhoto = photos.length > 0 ? photos[0].thumb : null;
  const location = data.pumpLocation;
  const peopleServed = data.socialInformation?.noOfPeopleServed;

  const dateStr = pump.createdTime
    ? new Date(pump.createdTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-sky-500/40">
      {/* Image Preview Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {mainPhoto && !imgError ? (
          <Image
            src={mainPhoto}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-zinc-600">
            <ImageOff className="h-10 w-10 stroke-1" />
            <span className="mt-1 text-xs">No preview image</span>
          </div>
        )}

        {/* Photo count badge */}
        {photos.length > 0 && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </div>
        )}

        {/* Impact Badge */}
        {typeof peopleServed === "number" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-sky-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-xs">
            <Users className="h-3.5 w-3.5" />
            <span>{peopleServed.toLocaleString()} served</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400">
          <Droplets className="h-3.5 w-3.5 shrink-0" />
          <span>Water Installation</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-sky-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
          {title}
        </h3>

        {/* Location Tags */}
        <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-zinc-500" />
          <span className="line-clamp-1">
            {[location?.village, location?.area, location?.country]
              .filter(Boolean)
              .join(", ") || "Location details unavailable"}
          </span>
        </div>

        {/* Installation Date */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{dateStr}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-zinc-800/80">
            <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
              ID: {pump.id.slice(0, 8)}...
            </span>

            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(pump)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Quick view
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href={`/pumps/${pump.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Full details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
