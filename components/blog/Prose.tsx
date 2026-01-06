import type { ReactNode } from "react";

export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-a:text-accent">
      {children}
    </div>
  );
}

