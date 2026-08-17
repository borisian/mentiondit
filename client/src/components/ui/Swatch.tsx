interface Props {
  color: string;
  shape?: "square" | "dot";
  className?: string;
}

export function Swatch({ color, shape = "square", className = "" }: Props) {
  return (
    <span
      aria-hidden
      className={`h-2 w-2 shrink-0 ${shape === "dot" ? "rounded-full" : "rounded-sm"} ${className}`}
      style={{ background: color }}
    />
  );
}
