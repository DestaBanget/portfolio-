import type { CSSProperties, ReactNode } from "react";

export function PageHeader({
  title,
  transitionName,
  children,
}: {
  title: string;
  /** Matches a heading on another page so the two morph into each other during navigation. */
  transitionName?: string;
  children?: ReactNode;
}) {
  return (
    <header className="pb-10 pt-12 md:pb-14 md:pt-20">
      <h1
        className={`${transitionName ? "" : "enter "}w-fit text-4xl font-semibold tracking-tight md:text-5xl`}
        style={transitionName ? { viewTransitionName: transitionName } : undefined}
      >
        {title}
      </h1>
      {children ? (
        <p className="enter mt-4 max-w-2xl text-lg text-text-secondary" style={{ "--i": 1 } as CSSProperties}>
          {children}
        </p>
      ) : null}
    </header>
  );
}
