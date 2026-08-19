import type { Mode } from "./types";

export interface ModeCopy {
  tab: string;
  blurb: string;
  topicLabel: string;
  topicPlaceholder: string;
  submit: string;
  hint: string;
  intro: string;
  empty: string;
  presets: { label: string; topic: string }[];
}

export const MODE_COPY: Record<Mode, ModeCopy> = {
  compare: {
    tab: "Comparer des marques",
    blurb:
      "Reddit est la source la plus citée par les moteurs de réponse IA. Mesurez ce qu'on y dit de votre marque et de vos concurrents — chiffré, daté, sourcé.",
    topicLabel: "Sujet ou catégorie",
    topicPlaceholder: "best wireless headphones",
    submit: "Analyser Reddit",
    hint: "Mentiondit détectera lui-même les noms qui reviennent le plus dans les discussions.",
    intro:
      "Entrez une catégorie. Mentiondit parcourt les discussions Reddit correspondantes, détecte les noms qui y reviennent et les classe — chaque chiffre renvoie au commentaire d'origine. Épinglez des marques seulement si vous voulez en suivre de précises.",
    empty:
      "Aucun nom récurrent détecté dans ces discussions. Essayez un sujet plus précis ou élargissez la période.",
    presets: [
      { label: "Casques audio", topic: "best wireless headphones" },
      { label: "CRM", topic: "best CRM for small business" },
      { label: "Running", topic: "best running shoes" },
    ],
  },
  recommend: {
    tab: "Demander une recommandation",
    blurb:
      "Posez une question comme vous la poseriez sur Reddit. Mentiondit lit les réponses à votre place et compte ce qui revient vraiment.",
    topicLabel: "Votre question",
    topicPlaceholder: "best brunch in Toronto",
    submit: "Demander à Reddit",
    hint: "Posez la question comme vous la poseriez sur Reddit — en anglais, la langue des discussions. Mentiondit compte les lieux et titres cités dans les réponses.",
    intro:
      "Posez votre question. Mentiondit lit les discussions Reddit qui y répondent, compte les lieux et titres cités, et vous rend un classement avec les extraits qui le justifient.",
    empty:
      "Rien de récurrent n'est ressorti de ces discussions. Reformulez la question, ou élargissez la période.",
    presets: [
      { label: "Brunch Toronto", topic: "best brunch in Toronto" },
      { label: "Ramen Londres", topic: "best ramen in London" },
      { label: "Films 2020s", topic: "most underrated movies of the 2020s" },
    ],
  },
};

export const EMPTY_PINNED =
  "Aucune des marques épinglées n'est citée dans ces discussions. Élargissez la période, ou videz le champ pour laisser la détection travailler.";
