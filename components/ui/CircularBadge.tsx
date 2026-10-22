'use client';

import { useId } from "react";

type Props = {
  fill?: string;
  textColor?: string;
};

/** Sticker with text running around a circle, slowly spinning. */
export default function CircularBadge({ fill = "#FF3D8B", textColor = "#0B0B14" }: Props) {
  const id = useId().replace(/:/g, "");
  const text = "Freelance Web Developer • Let's build • ";

  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="spin-badge h-full w-full">
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill={fill} stroke="#0B0B14" strokeWidth="2" />
        <text className="font-display" fontSize="9" fontWeight="800" letterSpacing="1.2" fill={textColor}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-3xl font-extrabold"
        style={{ color: textColor }}
      >
        ↗
      </span>
    </div>
  );
}
