import type { ReactNode } from "react";

export const CARD = "rounded-card border border-line bg-surface";

interface Props {
  title: string;
  description?: string;
  /** Rendered on the header's right — legends, actions. */
  aside?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, description, aside, children }: Props) {
  return (
    <section className={`${CARD} p-5`}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
