import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Link } from "next-view-transitions";
import { unstable_noStore as noStore } from "next/cache";
import { Chevron } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getWriteupPaths, platformName } from "@/lib/writeups";

export const metadata: Metadata = { title: "Writeups | Ferrel Destatiananda Edwardo" };

export default async function WriteupsPage() {
  noStore();
  const isAdmin = await isAdminAuthenticated();
  const paths = await getWriteupPaths(isAdmin ? { includePrivate: true, client: supabaseAdmin } : {});

  const rooms = paths.reduce((sum, path) => sum + path.rooms, 0);

  return (
    <div className="container-page pb-24 md:pb-32">
      <PageHeader title="Writeups" transitionName="writeups-title">
        Notes from the TryHackMe rooms I have finished, grouped by learning path and section.
        {rooms > 0 ? ` ${rooms} rooms across ${paths.length} paths.` : null}
      </PageHeader>

      {paths.length > 1 ? (
        <nav aria-label="Learning paths" className="enter mb-10 flex flex-wrap gap-2" style={{ "--i": 2 } as CSSProperties}>
          {paths.map((path) => (
            <a
              key={path.id}
              href={`#${path.id}`}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
            >
              {path.title}
            </a>
          ))}
        </nav>
      ) : null}

      {paths.length === 0 ? (
        <p className="text-text-secondary">No writeups published yet.</p>
      ) : (
        <div className="space-y-6">
          {paths.map((path) => (
              <section key={path.id} id={path.id} aria-labelledby={`${path.id}-title`} className="card reveal p-5 md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm text-text-tertiary">{platformName[path.platform]}</p>
                    <h2 id={`${path.id}-title`} className="mt-1 text-2xl font-semibold tracking-tight">
                      {path.title}
                    </h2>
                  </div>
                  <p className="text-sm text-text-tertiary">
                    {path.rooms} rooms
                    {path.writeups > 0 ? ` · ${path.writeups} ${path.writeups === 1 ? "writeup" : "writeups"}` : null}
                  </p>
                </div>

                <div className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {path.sections.map((section) => (
                    <details key={section.id} className="group expand">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-raised/60 md:px-5 [&::-webkit-details-marker]:hidden">
                        <span className="flex-1 font-medium">{section.title}</span>
                        <span className="text-sm text-text-tertiary">
                          {section.rooms.length} {section.rooms.length === 1 ? "room" : "rooms"}
                        </span>
                        <Chevron className="text-text-tertiary transition-transform group-open:rotate-180" />
                      </summary>

                      {section.rooms.length === 0 ? (
                        <p className="px-4 pb-4 text-sm text-text-secondary md:px-5">No public rooms in this section yet.</p>
                      ) : (
                        <ul className="px-4 pb-3 md:px-5">
                          {section.rooms.map((room) => (
                            <li key={room.id} className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 border-t border-border/60 py-2 first:border-t-0">
                              <span>
                                {room.readable ? (
                                  <Link href={`/writeups/${room.id}`} className="link">
                                    {room.title}
                                  </Link>
                                ) : (
                                  <span className="text-text-secondary">{room.title}</span>
                                )}
                              </span>
                              <span className="text-sm text-text-tertiary">
                                {room.difficulty}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  ))}
                </div>
              </section>
          ))}
        </div>
      )}
    </div>
  );
}
