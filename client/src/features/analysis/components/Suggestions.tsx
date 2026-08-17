import { Panel } from "@/components/ui/Panel";

interface Props {
  suggestions: { name: string; mentions: number }[];
  onAdd: (name: string) => void;
}

export function Suggestions({ suggestions, onAdd }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <Panel title="Aussi mentionné" description="Détectés mais hors du classement. Cliquez pour les épingler et relancer.">
      <ul className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <li key={suggestion.name}>
            <button type="button" onClick={() => onAdd(suggestion.name)} className="pill">
              {suggestion.name}
              <span className="num text-muted">{suggestion.mentions}</span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
