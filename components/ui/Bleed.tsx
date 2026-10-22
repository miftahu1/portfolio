import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
};

/** Breaks out of the page's max-width container so a colour block can run edge to edge. */
export default function Bleed({ children, className = "", innerClassName = "", style }: Props) {
  return (
    <div
      className={className}
      style={{ marginLeft: "calc(50% - 50vw)", width: "100vw", ...style }}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${innerClassName}`}>{children}</div>
    </div>
  );
}
