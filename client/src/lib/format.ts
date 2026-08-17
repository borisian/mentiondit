// Intl constructors are expensive — building them per call measured ~200x slower
// than reusing one, and a results render makes ~50 of these.
const NUMBER = new Intl.NumberFormat("fr-FR");
const MONTH = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" });
const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export const formatNumber = (value: number): string => NUMBER.format(value);

export const formatMonth = (month: string): string => {
  const [year, index] = month.split("-");
  return MONTH.format(new Date(Number(year), Number(index) - 1, 1));
};

export const formatDate = (createdUtc: number): string => DATE.format(new Date(createdUtc * 1000));
