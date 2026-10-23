import { Link } from "next-view-transitions";
import { buttonBase, buttonSizes, buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page pb-24 pt-16 md:pt-24">
      <p className="font-mono text-sm text-text-tertiary">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-lg text-text-secondary">
        Nothing lives at this address. Private writeups also land here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={`${buttonBase} ${buttonVariants.primary} ${buttonSizes.lg}`}>
          Go home
        </Link>
        <Link href="/writeups" className={`${buttonBase} ${buttonVariants.outline} ${buttonSizes.lg}`}>
          Browse writeups
        </Link>
      </div>
    </div>
  );
}
