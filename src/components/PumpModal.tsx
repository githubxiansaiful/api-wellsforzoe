"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PumpDetail } from "@/types/pump";
import { fetchPumpById } from "@/lib/api";
import {
  X,
  MapPin,
  Users,
  Calendar,
  ExternalLink,
  Droplets,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Navigation,
} from "lucide-react";

interface PumpModalProps {
  pumpId: string | null;
  onClose: () => void;
}

export default function PumpModal({ pumpId, onClose }: PumpModalProps) {
  const [pump, setPump] = useState<PumpDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    if (!pumpId) return;

    let isMounted = true;
    setLoading(true);
    setActivePhotoIdx(0);

    fetchPumpById(pumpId)
      .then((data) => {
        if (isMounted) {
          setPump(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pumpId]);

  if (!pumpId) return null;

  const data = pump?.data;
  const photos = data?.referencedPhotos || [];
  const currentPhoto = photos[activePhotoIdx];
  const location = data?.pumpLocation;
  const coords = data?.idDetails;
  const dedications = data?.photosOfInstallation?.donorOrPumpDedication || [];
  const storyHtml = data?.commentAndStory?.commentAndStoryOfInstallationOrMaintenance;

  const googleMapsUrl =
    coords?.latitude && coords?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <Droplets className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Water Pump Profile
              </h2>
              <p className="font-mono text-xs text-slate-400 dark:text-zinc-500">
                ID: {pumpId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {loading ? (
            <div className="flex min-h-75 flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-sky-400" />
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Loading pump records...
              </p>
            </div>
          ) : pump && data ? (
            <div className="space-y-6">
              {/* Photo Gallery with Slider */}
              {photos.length > 0 && (
                <div className="space-y-3">
                  <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-slate-950">
                    <Image
                      src={currentPhoto?.full || currentPhoto?.thumb || ""}
                      alt={data.titleOfPump || "Pump photo"}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />

                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActivePhotoIdx((prev) =>
                              prev === 0 ? photos.length - 1 : prev - 1
                            )
                          }
                          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            setActivePhotoIdx((prev) =>
                              prev === photos.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                          {activePhotoIdx + 1} / {photos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {photos.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            idx === activePhotoIdx
                              ? "border-sky-500 ring-2 ring-sky-500/20"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={p.thumb || ""}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Title and Key Details */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {data.titleOfPump || "Wells for Zoë Pump"}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  {[location?.village, location?.area, location?.country]
                    .filter(Boolean)
                    .join(", ") || "Location unlisted"}
                </p>
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <Users className="h-4 w-4 text-sky-500" />
                    People Served
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {data.socialInformation?.noOfPeopleServed?.toLocaleString() ||
                      "N/A"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    Installation Date
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {pump.createdTime
                      ? new Date(pump.createdTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <Navigation className="h-4 w-4 text-amber-500" />
                    Coordinates
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {coords?.latitude && coords?.longitude ? (
                      <div className="flex flex-col">
                        <span>
                          {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                        </span>
                        {googleMapsUrl && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline dark:text-sky-400"
                          >
                            Open Maps <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ) : (
                      "Not recorded"
                    )}
                  </div>
                </div>
              </div>

              {/* Donors / Dedication */}
              {dedications.length > 0 && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 dark:border-rose-950/40 dark:bg-rose-950/20">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-400">
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    Donors & Dedication
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dedications.map((d, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-rose-800 shadow-xs dark:bg-zinc-800 dark:text-rose-300"
                      >
                        {d.title || "Anonymous Donor"}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments & Story */}
              {storyHtml && (
                <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Field Notes & Community Story
                  </h3>
                  <div
                    className="prose prose-sm mt-3 max-w-none text-slate-600 dark:prose-invert dark:text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: storyHtml }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              Pump details could not be loaded.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Link
            href={`/pumps/${pumpId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-sky-600 dark:text-zinc-400 dark:hover:text-sky-400"
          >
            Open standalone page <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
