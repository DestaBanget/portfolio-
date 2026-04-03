"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

interface WriteupSection {
  id: string;
  title: string;
  platform: "THM" | "HTB" | "CTF" | "Other";
  order_index_global?: number;
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
  sections: WriteupSection[];
  rooms: WriteupRoom[];
}

const platformTone: Record<WriteupSection["platform"], string> = {
  THM: "bg-accent-green/10 text-accent-green border-accent-green/30",
  HTB: "bg-accent-warm/10 text-accent-warm border-accent-warm/30",
  CTF: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Other: "bg-surface-raised text-text-secondary border-border",
};

function splitRoomTitle(title: string) {
  const roomTitle = title.trim();
  const match = roomTitle.match(/^(.*?)\s*-\s*(.+)$/);
  if (!match) return { group: null as string | null, leaf: roomTitle };

  const group = match[1].trim();
  const leaf = match[2].trim();

  if (!group || !leaf) return { group: null as string | null, leaf: roomTitle };

  return { group, leaf };
}

function normalizeRoomTitleForSection(title: string, sectionTitle: string) {
  const roomTitle = title.trim();
  const section = sectionTitle.trim();
  if (!roomTitle || !section) return roomTitle;

  const roomTitleLower = roomTitle.toLowerCase();
  const sectionLower = section.toLowerCase();
  const prefix = `${sectionLower} - `;

  if (roomTitleLower.startsWith(prefix)) {
    return roomTitle.slice(prefix.length).trim();
  }

  return roomTitle;
}

export function WriteupTree({ sections, rooms }: WriteupTreeProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => (a.order_index_global ?? 0) - (b.order_index_global ?? 0)),
    [sections],
  );

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
      {sortedSections.map((section) => {
        const sectionOpen = openSections[section.id] ?? false;
        const sectionRooms = roomsBySection.get(section.id) ?? [];

        return (
          <div key={section.id} className="surface-card overflow-hidden">
            <Button
              onClick={() => setOpenSections((prev) => ({ ...prev, [section.id]: !sectionOpen }))}
              variant="ghost"
              size="md"
              className="h-auto w-full justify-between border-0 p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📂</span>
                <span className="font-display text-xl text-text-primary">{section.title}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${platformTone[section.platform]}`}>{section.platform}</span>
              </div>
              <span className="text-text-secondary">{sectionOpen ? "−" : "+"}</span>
            </Button>

            <div className={`grid transition-all duration-300 ${sectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="border-t border-border px-4 py-3">
                  {sectionRooms.length === 0 ? <p className="text-xs text-text-muted">No public rooms.</p> : null}

                  <div className="mt-4 space-y-1 border-l border-border/50 pl-3 md:pl-4">
                    {(roomsBySection.get(section.id) ?? []).map((room) => {
                      const { leaf } = splitRoomTitle(normalizeRoomTitleForSection(room.title || "", section.title));

                      return (
                        <div key={room.id} className="group/room relative flex items-center justify-between rounded p-2 transition-colors hover:bg-surface-raised">
                          {room.is_public && room.content ? (
                            <Link href={`/writeups/${room.id}`} className="flex-1">
                              <div className="flex items-center gap-2 text-sm text-text-secondary transition-colors group-hover/room:text-text-primary">
                                <span className="text-accent-blue">📄</span>
                                <span className="font-medium">{leaf}</span>
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
                              <span>{leaf}</span>
                              {room.difficulty ? (
                                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider">
                                  {room.difficulty}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
