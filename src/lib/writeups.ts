import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type Platform = "THM" | "HTB" | "CTF" | "Other";
export type Difficulty = "Easy" | "Medium" | "Hard" | "Insane";

export interface Room {
  id: string;
  title: string;
  difficulty: Difficulty | null;
  /** Public and has a written note, so it gets its own page. */
  readable: boolean;
}

export interface Section {
  id: string;
  title: string;
  rooms: Room[];
}

export interface Path {
  id: string;
  title: string;
  platform: Platform;
  sections: Section[];
  /** Rooms in the path. Paths that overlap another path only list the rooms not already covered there. */
  rooms: number;
  /** Rooms with a readable writeup. */
  writeups: number;
}

interface PathRow {
  id: string;
  title: string;
  platform: Platform;
}

interface SectionRow {
  id: string;
  path_id: string | null;
  title: string;
}

interface RoomRow {
  id: string;
  section_id: string;
  title: string | null;
  difficulty: Difficulty | null;
  is_public: boolean;
}

/**
 * Room titles are often stored with their section as a prefix
 * ("Burp Suite - Burp Suite: Repeater"); show only the room's own name.
 */
function roomLabel(title: string, sectionTitle: string) {
  const trimmed = title.trim();
  const prefix = `${sectionTitle.trim().toLowerCase()} - `;
  const withoutSection = trimmed.toLowerCase().startsWith(prefix) ? trimmed.slice(prefix.length).trim() : trimmed;
  const grouped = withoutSection.match(/^(.+?)\s+-\s+(.+)$/);
  return grouped ? grouped[2].trim() : withoutSection;
}

/** Loads every path with its sections and rooms. Private rooms are only included for the admin client. */
export async function getWriteupPaths(options: { includePrivate?: boolean; client?: SupabaseClient } = {}): Promise<Path[]> {
  const db = options.client ?? supabase;

  // The list only needs to know a note exists. Selecting the notes themselves made this route take seconds.
  const [paths, sections, rooms, written] = await Promise.all([
    db.from("wu_paths").select("id,title,platform").order("order_index", { ascending: true }),
    db.from("wu_sections").select("id,path_id,title").order("order_index", { ascending: true }),
    db
      .from("wu_rooms")
      .select("id,section_id,title,difficulty,is_public")
      .order("order_index", { ascending: true }),
    db.from("wu_rooms").select("id").not("content", "is", null).neq("content", ""),
  ]);

  const failed = paths.error ?? sections.error ?? rooms.error ?? written.error;
  if (failed) throw new Error(`writeups: ${failed.message}`);

  const roomRows = ((rooms.data ?? []) as RoomRow[]).filter((room) => options.includePrivate || room.is_public);
  const withNote = new Set((written.data ?? []).map((room) => room.id as string));

  return ((paths.data ?? []) as PathRow[]).map((path) => {
    const pathSections = ((sections.data ?? []) as SectionRow[])
      .filter((section) => section.path_id === path.id)
      .map((section) => {
        const sectionRooms = roomRows
          .filter((room) => room.section_id === section.id)
          .map((room) => ({
            id: room.id,
            title: roomLabel(room.title ?? "", section.title),
            difficulty: room.difficulty,
            readable: room.is_public && withNote.has(room.id),
          }));

        return { id: section.id, title: section.title, rooms: sectionRooms };
      });

    return {
      id: path.id,
      title: path.title,
      platform: path.platform,
      sections: pathSections,
      rooms: pathSections.reduce((sum, section) => sum + section.rooms.length, 0),
      writeups: pathSections.reduce((sum, section) => sum + section.rooms.filter((room) => room.readable).length, 0),
    };
  });
}

export const platformName: Record<Platform, string> = {
  THM: "TryHackMe",
  HTB: "Hack The Box",
  CTF: "CTF",
  Other: "Other",
};
