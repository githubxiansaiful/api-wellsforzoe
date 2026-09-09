import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchPumpById } from "@/lib/api";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Navigation,
  Heart,
  ExternalLink,
  Code,
  Droplet,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PumpDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pump = await fetchPumpById(id);

  if (!pump) {
    notFound();
  }

  const data = pump.data;
  const photos = data.referencedPhotos || [];
  const coords = data.idDetails;
  const location = data.pumpLocation;
  const dedications = data.photosOfInstallation?.donorOrPumpDedication || [];
  const storyHtml = data.commentAndStory?.commentAndStoryOfInstallationOrMaintenance;

  const googleMapsUrl =
    coords?.latitude && coords?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`
      : null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 text-slate-900 dark:bg-black dark:text-zinc-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <span className="font-mono text-xs text-slate-400 dark:text-zinc-500">
            ID: {pump.id}
          </span>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        {/* Title Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-sky-600 uppercase dark:text-sky-400">
            <Droplet className="h-4 w-4 fill-sky-600 dark:fill-sky-400" />
            Wells for Zoë Water Pump
          </div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
            {data.titleOfPump || "Pump Installation Details"}
          </h1>
          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
            <MapPin className="h-4 w-4 text-sky-500" />
            {[location?.village, location?.area, location?.country]
              .filter(Boolean)
              .join(", ") || "Location information not recorded"}
          </p>
        </div>

        {/* Photo Gallery Grid */}
        {photos.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
              Field Photographs ({photos.length})
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100 shadow-xs transition hover:shadow-lg dark:bg-zinc-800"
                >
                  <Image
                    src={photo.full || photo.thumb || ""}
                    alt={`${data.titleOfPump || "Pump"} photo ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.full && (
                    <a
                      href={photo.full}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-xs transition group-hover:opacity-100"
                    >
                      Full resolution <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Metrics and Detail Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* People Served */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-600 uppercase dark:text-sky-400">
              <Users className="h-4 w-4" />
              Community Beneficiaries
            </div>
            <div className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
              {data.socialInformation?.noOfPeopleServed?.toLocaleString() || "N/A"}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Residents provided with clean, safe drinking water.
            </p>
          </div>

          {/* Date of Installation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              <Calendar className="h-4 w-4" />
              Installation Date
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {pump.createdTime
                ? new Date(pump.createdTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not available"}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Official record creation timestamp.
            </p>
          </div>

          {/* GPS Coordinates & Map Link */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
              <Navigation className="h-4 w-4" />
              GPS Coordinates
            </div>
            <div className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              {coords?.latitude && coords?.longitude ? (
                <>
                  {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                </>
              ) : (
                "No GPS coordinates recorded"
              )}
            </div>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
              >
                View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Dedication and Story Sections */}
        <div className="mt-8 space-y-6">
          {dedications.length > 0 && (
            <section className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6 dark:border-rose-950/40 dark:bg-rose-950/20">
              <h2 className="flex items-center gap-2 text-base font-bold text-rose-800 dark:text-rose-300">
                <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                Donor & Dedication Information
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {dedications.map((d, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-rose-900 shadow-xs dark:bg-zinc-800 dark:text-rose-200"
                  >
                    <span>{d.title || "Anonymous Donor"}</span>
                    {d.value && (
                      <span className="font-mono text-xs text-rose-400 dark:text-rose-500">
                        ({d.value})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {storyHtml && (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Field Notes & Community Story
              </h2>
              <div
                className="prose prose-slate mt-4 max-w-none text-slate-700 dark:prose-invert dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            </section>
          )}

          {/* Raw JSON inspection */}
          <details className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-slate-700 dark:text-zinc-300">
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4 text-slate-500" />
                Raw GraphQL Data (For Developers)
              </span>
              <span className="text-xs text-slate-400 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <pre className="mt-4 max-h-96 overflow-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-emerald-400 dark:bg-black">
              {JSON.stringify(pump, null, 2)}
            </pre>
          </details>
        </div>
      </main>
    </div>
  );
}
