"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

interface WriteupPath {
  id: string;
  title: string;
  platform: "THM" | "HTB" | "CTF" | "Other";
  order_index: number;
}

interface WriteupSection {
  id: string;
  path_id: string;
  title: string;
  order_index: number;
}

interface WriteupRoom {
  id: string;
  section_id: string;
  title: string;
  content: string | null;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane" | null;
  status: "completed" | "in-progress";
  is_public: boolean;
  order_index: number;
}

interface WriteupTreeProps {
  paths: WriteupPath[];
  sections: WriteupSection[];
  rooms: WriteupRoom[];
}

const platformTone: Record<WriteupPath["platform"], string> = {
  THM: "bg-accent-green/10 text-accent-green border-accent-green/30",
  HTB: "bg-accent-warm/10 text-accent-warm border-accent-warm/30",
  CTF: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Other: "bg-surface-raised text-text-secondary border-border",
};

export function WriteupTree({ paths, sections, rooms }: WriteupTreeProps) {
  const [openPaths, setOpenPaths] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sectionsByPath = useMemo(() => {
    const map = new Map<string, WriteupSection[]>();
    for (const section of sections) {
      map.set(section.path_id, [...(map.get(section.path_id) ?? []), section]);
    }
    map.forEach((v, k) => {
      map.set(k, [...v].sort((a, b) => a.order_index - b.order_index));
    });
    return map;
  }, [sections]);

  const roomsBySection = useMemo(() => {
    const map = new Map<string, WriteupRoom[]>();
    for (const room of rooms) {
      map.set(room.section_id, [...(map.get(room.section_id) ?? []), room]);
    }
    map.forEach((v, k) => {
      map.set(k, [...v].sort((a, b) => a.order_index - b.order_index));
    });
    return map;
  }, [rooms]);

  return (
    <div className="space-y-4">
      {paths.map((path) => {
        const pathOpen = openPaths[path.id] ?? false;
        const pathSections = sectionsByPath.get(path.id) ?? [];
        return (
          <div key={path.id} className="surface-card overflow-hidden">
            <Button
              onClick={() => setOpenPaths((prev) => ({ ...prev, [path.id]: !pathOpen }))}
              variant="ghost"
              size="md"
              className="h-auto w-full justify-between border-0 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📁</span>
                <span className="font-display text-xl text-text-primary">{path.title}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${platformTone[path.platform]}`}>{path.platform}</span>
              </div>
              <span className="text-text-secondary">{pathOpen ? "−" : "+"}</span>
            </Button>

            <div className={`grid transition-all duration-300 ${pathOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="border-t border-border px-4 py-3">
                  {pathSections.map((section) => {
                    const sectionOpen = openSections[section.id] ?? false;
                    const sectionRooms = roomsBySection.get(section.id) ?? [];

                    return (
                      <div key={section.id} className="mb-3 last:mb-0 rounded-lg border border-border bg-surface-raised/40">
                        <Button
                          onClick={() => setOpenSections((prev) => ({ ...prev, [section.id]: !sectionOpen }))}
                          variant="ghost"
                          size="sm"
                          className="h-auto w-full justify-between border-0 px-3 py-2 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span>📂</span>
                            <span className="text-sm font-medium text-text-primary">{section.title}</span>
                          </div>
                          <span className="text-text-secondary">{sectionOpen ? "−" : "+"}</span>
                        </Button>

                        <div className={`grid transition-all duration-300 ${sectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <div className="border-t border-border px-3 py-2">
                              {sectionRooms.length === 0 ? (
                                <p className="text-xs text-text-muted">No public rooms.</p>
                              ) : null}

                              {sectionRooms.map((room) => (
                                <div key={room.id} className="mb-2 last:mb-0 rounded-md border border-border bg-surface px-3 py-2">
                                  {room.content ? (
                                    <Link href={`/writeups/${room.id}`} className="group flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span>📄</span>
                                        <span className="text-sm text-text-primary transition-colors group-hover:text-accent">{room.title}</span>
                                        {room.difficulty ? (
                                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-secondary">
                                            {room.difficulty}
                                          </span>
                                        ) : null}
                                        {room.status === "completed" ? <span className="text-accent-green">✓</span> : null}
                                      </div>
                                    </Link>
                                  ) : (
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                      <span>📄</span>
                                      <span>{room.title}</span>
                                      {room.difficulty ? (
                                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider">
                                          {room.difficulty}
                                        </span>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
