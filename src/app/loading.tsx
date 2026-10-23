export default function Loading() {
  return (
    <div className="container-page pb-24 pt-16 md:pt-24" role="status" aria-label="Loading">
      <div className="h-12 w-2/3 max-w-lg rounded-lg bg-surface-raised motion-safe:animate-pulse" />
      <div className="mt-5 h-5 w-full max-w-xl rounded bg-surface-raised motion-safe:animate-pulse" />
      <div className="mt-3 h-5 w-4/5 max-w-md rounded bg-surface-raised motion-safe:animate-pulse" />
    </div>
  );
}
