"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/Button";

type SectionKey = "profile" | "contact" | "experience" | "writeups" | "projects";

interface ProfileRow {
  id: number;
  name: string | null;
  cv_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  whatsapp: string | null;
  contact_note: string | null;
  bio: string | null;
  terminal_lines: string[] | null;
}

interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  type: string;
  period_start: string;
  period_end: string | null;
  location: string | null;
  description: string | null;
  skills: string[] | null;
  order_index: number;
}

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  type: "security" | "competitive" | "dev" | "research" | null;
  status: "active" | "completed" | "wip" | null;
  url: string | null;
  is_public: boolean;
  order_index: number;
}

interface SectionRow {
  id: string;
  title: string;
  platform: "THM" | "HTB" | "CTF" | "Other";
  order_index_global: number;
}

interface RoomRow {
  id: string;
  section_id: string;
  title: string;
  content: string | null;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane" | null;
  status: "completed" | "in-progress";
  is_public: boolean;
  os: string | null;
  retired: boolean;
  tags: string[] | null;
  completed_at: string | null;
  order_index: number;
}

const sections: { key: SectionKey; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "contact", label: "Contact" },
  { key: "experience", label: "Experience" },
  { key: "writeups", label: "Writeups" },
  { key: "projects", label: "Projects" },
];

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }

  return res.json() as Promise<T>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "misc";
}

export function DashboardClient() {
  const [active, setActive] = useState<SectionKey>("profile");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [experience, setExperience] = useState<ExperienceRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [sectionsData, setSectionsData] = useState<SectionRow[]>([]);
  const [rooms, setRooms] = useState<RoomRow[]>([]);

  const [saving, setSaving] = useState(false);

  const showSuccess = (message: string) => setNotice({ type: "success", message });
  const showError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Action failed";
    setNotice({ type: "error", message });
  };

  const loadAll = async () => {
    const [profileRow, expRows, projectRows, sectionRows, roomRows] = await Promise.all([
      request<ProfileRow>("/loginytta/api/profile"),
      request<ExperienceRow[]>("/loginytta/api/experience"),
      request<ProjectRow[]>("/loginytta/api/projects"),
      request<SectionRow[]>("/loginytta/api/writeups/sections"),
      request<RoomRow[]>("/loginytta/api/writeups/rooms"),
    ]);

    setProfile(profileRow);
    setExperience(expRows);
    setProjects(projectRows);
    setSectionsData(sectionRows);
    setRooms(roomRows);
  };

  useEffect(() => {
    loadAll().catch(showError);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const sortedSections = useMemo(
    () => [...sectionsData].sort((a, b) => (a.order_index_global ?? 0) - (b.order_index_global ?? 0)),
    [sectionsData],
  );

  const roomsBySection = useMemo(() => {
    const map = new Map<string, RoomRow[]>();
    for (const room of rooms) {
      map.set(room.section_id, [...(map.get(room.section_id) ?? []), room]);
    }
    map.forEach((v, k) => {
      map.set(k, [...v].sort((a, b) => a.order_index - b.order_index));
    });
    return map;
  }, [rooms]);

  const logout = async () => {
    await fetch("/loginytta/api/logout", { method: "POST" });
    window.location.href = "/loginytta";
  };

  const addExperience = async () => {
    try {
      await request("/loginytta/api/experience", {
        method: "POST",
        body: JSON.stringify({
          company: "New Company",
          role: "Role",
          type: "Internship",
          period_start: new Date().toISOString().slice(0, 10),
          period_end: null,
          location: "",
          description: "",
          skills: [],
          order_index: experience.length,
        }),
      });
      await loadAll();
      showSuccess("Experience added successfully");
    } catch (error) {
      showError(error);
    }
  };

  const addProject = async () => {
    try {
      await request("/loginytta/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "New Project",
          description: "",
          type: "dev",
          status: "wip",
          url: "",
          is_public: true,
          order_index: projects.length,
        }),
      });
      await loadAll();
      showSuccess("Project added successfully");
    } catch (error) {
      showError(error);
    }
  };

  const addSection = async () => {
    try {
      await request("/loginytta/api/writeups/sections", {
        method: "POST",
        body: JSON.stringify({
          title: "New Section",
          platform: "THM",
          order_index_global: sectionsData.length,
        }),
      });
      await loadAll();
      showSuccess("Section added successfully");
    } catch (error) {
      showError(error);
    }
  };

  const addRoom = async (sectionId: string) => {
    try {
      await request("/loginytta/api/writeups/rooms", {
        method: "POST",
        body: JSON.stringify({
          section_id: sectionId,
          title: "New Room",
          content: "",
          difficulty: "Easy",
          status: "in-progress",
          is_public: false,
          os: "",
          retired: false,
          tags: [],
          completed_at: null,
          order_index: (roomsBySection.get(sectionId) ?? []).length,
        }),
      });
      await loadAll();
      showSuccess("Room added successfully");
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-6 py-8">
      <aside className="w-56 shrink-0 rounded-xl border border-border bg-surface p-4">
        <nav className="space-y-1">
          {sections.map((s) => (
            <Button
              key={s.key}
              onClick={() => setActive(s.key)}
              variant={active === s.key ? "outline" : "ghost"}
              size="sm"
              className={`w-full justify-start ${
                active === s.key ? "bg-accent text-white hover:text-white" : ""
              }`}
            >
              {s.label}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 rounded-xl border border-border bg-surface p-5">
        <header className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
          <h1 className="font-display text-2xl text-text-primary">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-accent hover:text-accent-light">
              View Site ↗
            </Link>
            <Button onClick={logout} variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </header>

        {notice ? (
          <div
            className={`mb-4 rounded-md border px-3 py-2 text-sm ${
              notice.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        {active === "profile" && profile ? (
          <section className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-md border border-border bg-surface-raised px-3 py-2" value={profile.name ?? ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" />
              <input className="rounded-md border border-border bg-surface-raised px-3 py-2" value={profile.cv_url ?? ""} onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })} placeholder="CV URL" />
              <input className="rounded-md border border-border bg-surface-raised px-3 py-2" value={profile.linkedin_url ?? ""} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} placeholder="LinkedIn URL" />
              <input className="rounded-md border border-border bg-surface-raised px-3 py-2" value={profile.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" />
            </div>
            <textarea className="min-h-24 w-full rounded-md border border-border bg-surface-raised px-3 py-2" value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Bio" />
            <textarea
              className="min-h-36 w-full rounded-md border border-border bg-surface-raised px-3 py-2 font-mono text-sm"
              value={(profile.terminal_lines ?? []).join("\n")}
              onChange={(e) => setProfile({ ...profile, terminal_lines: e.target.value.split("\n") })}
              placeholder="Terminal lines (one per line)"
            />
            <Button
              variant="primary"
              size="md"
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true);
                  await request("/loginytta/api/profile", {
                    method: "PATCH",
                    body: JSON.stringify(profile),
                  });
                  showSuccess("Profile saved successfully");
                } catch (error) {
                  showError(error);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </section>
        ) : null}

        {active === "contact" && profile ? (
          <section className="space-y-4">
            <input
              className="w-full rounded-md border border-border bg-surface-raised px-3 py-2"
              value={profile.contact_note ?? ""}
              onChange={(e) => setProfile({ ...profile, contact_note: e.target.value })}
              placeholder="Contact note / subtitle"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-border bg-surface-raised px-3 py-2"
                value={profile.linkedin_url ?? ""}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="LinkedIn URL"
              />
              <input
                className="rounded-md border border-border bg-surface-raised px-3 py-2"
                value={profile.github_url ?? ""}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="GitHub URL"
              />
              <input
                className="rounded-md border border-border bg-surface-raised px-3 py-2"
                value={profile.email ?? ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Email"
              />
              <input
                className="rounded-md border border-border bg-surface-raised px-3 py-2"
                value={profile.whatsapp ?? ""}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="WhatsApp (optional)"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                try {
                  await request("/loginytta/api/profile", {
                    method: "PATCH",
                    body: JSON.stringify(profile),
                  });
                  await loadAll();
                  showSuccess("Contact saved successfully");
                } catch (error) {
                  showError(error);
                }
              }}
            >
              Save
            </Button>
          </section>
        ) : null}

        {active === "experience" ? (
          <section className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={addExperience}>
                Add new
              </Button>
            </div>
            <p className="text-xs text-text-muted">Most recently added appears first on the public page</p>
            <div className="space-y-4">
              {experience.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={item.company} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, company: e.target.value } : x)))} placeholder="Company" />
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={item.role} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, role: e.target.value } : x)))} placeholder="Role" />
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={item.type} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, type: e.target.value } : x)))} placeholder="Type" />
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={item.location ?? ""} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, location: e.target.value } : x)))} placeholder="Location" />
                    <input type="date" className="rounded border border-border bg-surface-raised px-2 py-1" value={item.period_start} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, period_start: e.target.value } : x)))} />
                    <input type="date" className="rounded border border-border bg-surface-raised px-2 py-1" value={item.period_end ?? ""} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, period_end: e.target.value || null } : x)))} />
                  </div>
                  <textarea className="mt-2 min-h-20 w-full rounded border border-border bg-surface-raised px-2 py-1" value={item.description ?? ""} onChange={(e) => setExperience((prev) => prev.map((x) => (x.id === item.id ? { ...x, description: e.target.value } : x)))} placeholder="Description" />
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={async () => {
                        try {
                          await request(`/loginytta/api/experience/${item.id}`, {
                            method: "PATCH",
                            body: JSON.stringify(item),
                          });
                          await loadAll();
                          showSuccess("Experience saved successfully");
                        } catch (error) {
                          showError(error);
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        try {
                          await request(`/loginytta/api/experience/${item.id}`, { method: "DELETE" });
                          await loadAll();
                          showSuccess("Experience deleted successfully");
                        } catch (error) {
                          showError(error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {active === "writeups" ? (
          <section className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={addSection}>
                Add Section
              </Button>
            </div>
            <div className="space-y-4">
              {sortedSections.map((section) => (
                <div key={section.id} className="rounded-lg border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="rounded border border-border bg-surface-raised px-2 py-1"
                      value={section.title}
                      onChange={(e) => setSectionsData((prev) => prev.map((x) => (x.id === section.id ? { ...x, title: e.target.value } : x)))}
                      placeholder="Section title"
                    />
                    <select
                      className="rounded border border-border bg-surface-raised px-2 py-1"
                      value={section.platform}
                      onChange={(e) =>
                        setSectionsData((prev) =>
                          prev.map((x) =>
                            x.id === section.id ? { ...x, platform: e.target.value as SectionRow["platform"] } : x,
                          ),
                        )
                      }
                    >
                      <option>THM</option>
                      <option>HTB</option>
                      <option>CTF</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={async () => {
                        try {
                          await request(`/loginytta/api/writeups/sections/${section.id}`, { method: "PATCH", body: JSON.stringify(section) });
                          await loadAll();
                          showSuccess("Section saved successfully");
                        } catch (error) {
                          showError(error);
                        }
                      }}
                    >
                      Save Section
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addRoom(section.id)}>
                      Add Room
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        try {
                          await request(`/loginytta/api/writeups/sections/${section.id}`, { method: "DELETE" });
                          await loadAll();
                          showSuccess("Section deleted successfully");
                        } catch (error) {
                          showError(error);
                        }
                      }}
                    >
                      Delete Section
                    </Button>
                  </div>

                  <div className="mt-3 space-y-2 border-l border-border pl-3">
                    {(roomsBySection.get(section.id) ?? []).map((room) => (
                      <div key={room.id} className="rounded border border-border p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <input className="w-full rounded border border-border bg-surface-raised px-2 py-1" value={room.title} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, title: e.target.value } : x)))} />
                          <span className="text-xs">{room.is_public ? "🌐" : "🔒"}</span>
                        </div>
                        <div className="grid gap-2 md:grid-cols-3">
                          <select className="rounded border border-border bg-surface-raised px-2 py-1" value={room.difficulty ?? "Easy"} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, difficulty: e.target.value as RoomRow["difficulty"] } : x)))}>
                            <option>Easy</option><option>Medium</option><option>Hard</option><option>Insane</option>
                          </select>
                          <input className="rounded border border-border bg-surface-raised px-2 py-1" value={room.os ?? ""} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, os: e.target.value } : x)))} placeholder="OS" />
                          <select className="rounded border border-border bg-surface-raised px-2 py-1" value={room.status} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, status: e.target.value as RoomRow["status"] } : x)))}>
                            <option value="in-progress">in-progress</option>
                            <option value="completed">completed</option>
                          </select>
                        </div>
                        <div className="mt-2 flex gap-3 text-xs">
                          <label className="flex items-center gap-1"><input type="checkbox" checked={room.is_public} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, is_public: e.target.checked } : x)))} /> public</label>
                          <label className="flex items-center gap-1"><input type="checkbox" checked={room.retired} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, retired: e.target.checked } : x)))} /> retired</label>
                        </div>
                        <input className="mt-2 w-full rounded border border-border bg-surface-raised px-2 py-1" value={(room.tags ?? []).join(", ")} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } : x)))} placeholder="tags (comma separated)" />
                        <textarea className="mt-2 min-h-28 w-full rounded border border-border bg-surface-raised px-2 py-1 font-mono text-sm" value={room.content ?? ""} onChange={(e) => setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, content: e.target.value } : x)))} placeholder="Markdown content" />
                        <div className="mt-2 space-y-2">
                          <ImageUploader folder={slugify(room.title)} />
                          <p className="text-xs text-text-tertiary">Copy the URL above and use it in markdown as: ![description](url)</p>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button variant="primary" size="sm" onClick={async () => {
                            try {
                              await request(`/loginytta/api/writeups/rooms/${room.id}`, { method: "PATCH", body: JSON.stringify(room) });
                              await loadAll();
                              showSuccess("Room saved successfully");
                            } catch (error) {
                              showError(error);
                            }
                          }}>Save Room</Button>
                          <Button variant="danger" size="sm" onClick={async () => {
                            try {
                              await request(`/loginytta/api/writeups/rooms/${room.id}`, { method: "DELETE" });
                              await loadAll();
                              showSuccess("Room deleted successfully");
                            } catch (error) {
                              showError(error);
                            }
                          }}>Delete Room</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {active === "projects" ? (
          <section className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={addProject}>
                Add new
              </Button>
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-border p-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={project.title} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, title: e.target.value } : x)))} placeholder="Title" />
                    <input className="rounded border border-border bg-surface-raised px-2 py-1" value={project.url ?? ""} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, url: e.target.value } : x)))} placeholder="URL" />
                    <select className="rounded border border-border bg-surface-raised px-2 py-1" value={project.type ?? "dev"} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, type: e.target.value as ProjectRow["type"] } : x)))}>
                      <option value="security">security</option><option value="competitive">competitive</option><option value="dev">dev</option><option value="research">research</option>
                    </select>
                    <select className="rounded border border-border bg-surface-raised px-2 py-1" value={project.status ?? "wip"} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, status: e.target.value as ProjectRow["status"] } : x)))}>
                      <option value="active">active</option><option value="completed">completed</option><option value="wip">wip</option>
                    </select>
                  </div>
                  <textarea className="mt-2 min-h-20 w-full rounded border border-border bg-surface-raised px-2 py-1" value={project.description ?? ""} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, description: e.target.value } : x)))} placeholder="Description" />
                  <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={project.is_public} onChange={(e) => setProjects((prev) => prev.map((x) => (x.id === project.id ? { ...x, is_public: e.target.checked } : x)))} /> Public</label>
                  <div className="mt-3 flex gap-2">
                    <Button variant="primary" size="md" onClick={async () => {
                      try {
                        await request(`/loginytta/api/projects/${project.id}`, { method: "PATCH", body: JSON.stringify(project) });
                        await loadAll();
                        showSuccess("Project saved successfully");
                      } catch (error) {
                        showError(error);
                      }
                    }}>Save</Button>
                    <Button variant="danger" size="sm" onClick={async () => {
                      try {
                        await request(`/loginytta/api/projects/${project.id}`, { method: "DELETE" });
                        await loadAll();
                        showSuccess("Project deleted successfully");
                      } catch (error) {
                        showError(error);
                      }
                    }}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
