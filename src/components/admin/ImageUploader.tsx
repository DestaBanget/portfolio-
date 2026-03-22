"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEventHandler } from "react";

interface ImageUploaderProps {
  folder?: string;
}

export function ImageUploader({ folder = "misc" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = async (file: File) => {
    setError("");
    setCopied(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder || "misc");

      const res = await fetch("/loginytta/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onPickFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    event.target.value = "";
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="cursor-pointer rounded border border-dashed border-border bg-surface-raised px-3 py-4 text-center text-sm text-text-secondary hover:border-accent"
      >
        {uploading ? "Uploading..." : "Click or drag an image here to upload"}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickFile}
      />

      {url ? (
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-border bg-surface-raised px-2 py-1 text-xs"
            value={url}
            readOnly
          />
          <button
            type="button"
            onClick={copyUrl}
            className="rounded border border-border px-2 py-1 text-xs hover:text-accent"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
