interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  label?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  label,
}: Props<T>) {
  return (
    <div className="flex gap-1 rounded-lg bg-sunken p-1" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-md transition ${
            size === "sm" ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
          } ${
            option.value === value
              ? "bg-surface text-ink shadow-sm"
              : "text-secondary hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
