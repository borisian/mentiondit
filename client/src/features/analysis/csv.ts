import type { AnalyzeResponse } from "./types";

const HEADERS = [
  "nom",
  "mentions",
  "part_de_voix",
  "commentaires",
  "discussions",
  "upvotes_cumules",
  "positif",
  "neutre",
  "negatif",
];

const escape = (value: string | number): string =>
  typeof value === "number" ? String(value) : `"${value.replace(/"/g, '""')}"`;

export function downloadCsv(result: AnalyzeResponse): void {
  const rows = result.brands.map((brand) =>
    [
      brand.name,
      brand.mentions,
      Number((brand.shareOfVoice * 100).toFixed(2)),
      brand.commentCount,
      brand.threadCount,
      brand.netScore,
      brand.sentiment.positive,
      brand.sentiment.neutral,
      brand.sentiment.negative,
    ]
      .map(escape)
      .join(",")
  );

  const csv = [HEADERS.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));

  const link = document.createElement("a");
  link.href = url;
  link.download = `comment-hub-${result.topic.replace(/\W+/g, "-").toLowerCase()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
