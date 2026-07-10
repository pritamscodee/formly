export interface Field {
  id: string;
  type: string;
  title: string;
  order: number;
  options: { id: string; label: string }[];
}

export interface Answer {
  fieldId: string;
  value: string;
}

export interface Submission {
  id: string;
  channelId: string | null;
  respondentEmail: string | null;
  createdAt: string;
  answers: Answer[];
}

export interface ColumnAnalysis {
  fieldId: string;
  title: string;
  type: string;
  dataType: "text" | "number" | "email" | "url" | "phone" | "date" | "boolean" | "file" | "choice" | "rating";
  totalCount: number;
  filledCount: number;
  emptyCount: number;
  fillRate: number;
  uniqueCount: number;
  mode: string | null;
  avg: number | null;
  min: string | null;
  max: string | null;
  distribution: { value: string; count: number; percent: number }[];
  outliers: string[];
  suggestions: string[];
}

export interface DataAnalysis {
  columns: ColumnAnalysis[];
  totalRows: number;
  overallFillRate: number;
  summary: string[];
  qualityScore: number;
}

function parseAnswerValue(raw: string): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.join(", ");
    if (typeof parsed === "object" && parsed !== null && parsed.url) return parsed.name || parsed.url;
    return String(parsed);
  } catch {
    return raw;
  }
}

function detectDataType(rawValues: string[], fieldType: string): ColumnAnalysis["dataType"] {
  if (fieldType === "file_upload") return "file";
  if (fieldType === "email") return "email";
  if (fieldType === "phone") return "phone";
  if (fieldType === "website") return "url";
  if (fieldType === "date") return "date";
  if (fieldType === "rating" || fieldType === "opinion_scale") return "rating";
  if (fieldType === "yes_no") return "boolean";
  if (fieldType === "multiple_choice" || fieldType === "dropdown" || fieldType === "checkboxes") return "choice";

  const nonEmpty = rawValues.filter((v) => v.length > 0);
  if (nonEmpty.length === 0) return "text";

  const numericCount = nonEmpty.filter((v) => !isNaN(parseFloat(v)) && isFinite(Number(v))).length;
  if (numericCount / nonEmpty.length > 0.8) return "number";

  const emailCount = nonEmpty.filter((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)).length;
  if (emailCount / nonEmpty.length > 0.8) return "email";

  const urlCount = nonEmpty.filter((v) => /^https?:\/\//.test(v)).length;
  if (urlCount / nonEmpty.length > 0.8) return "url";

  const phoneCount = nonEmpty.filter((v) => /^[\+]?[\d\s\-\(\)]{7,}$/.test(v)).length;
  if (phoneCount / nonEmpty.length > 0.8) return "phone";

  return "text";
}

function computeDistribution(values: string[]): { value: string; count: number; percent: number }[] {
  const counts: Record<string, number> = {};
  const nonEmpty = values.filter((v) => v.length > 0);
  for (const v of nonEmpty) {
    counts[v] = (counts[v] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count, percent: nonEmpty.length > 0 ? Math.round((count / nonEmpty.length) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function detectOutliers(values: string[], dataType: ColumnAnalysis["dataType"]): string[] {
  if (dataType !== "number") return [];
  const nums = values.map(Number).filter((n) => !isNaN(n));
  if (nums.length < 4) return [];

  const sorted = [...nums].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  return [...new Set(nums.filter((n) => n < lower || n > upper).map(String))];
}

function formatSmart(value: string, dataType: ColumnAnalysis["dataType"]): string {
  if (!value) return "—";
  if (dataType === "rating") {
    const n = parseInt(value, 10);
    if (!isNaN(n)) return `${"★".repeat(n)}${"☆".repeat(Math.max(0, 5 - n))} ${n}/5`;
  }
  if (dataType === "number") {
    const n = parseFloat(value);
    if (!isNaN(n)) return n.toLocaleString();
  }
  if (dataType === "boolean") {
    return value === "Yes" ? "✓ Yes" : value === "No" ? "✗ No" : value;
  }
  if (dataType === "file") {
    try {
      const parsed = JSON.parse(value);
      if (parsed?.name) return parsed.name;
    } catch { /* */ }
  }
  return value;
}

export function analyzeSubmissions(fields: Field[], submissions: Submission[]): DataAnalysis {
  const columns: ColumnAnalysis[] = fields.map((field) => {
    const rawValues = submissions.map((sub) => {
      const answer = sub.answers.find((a) => a.fieldId === field.id);
      return answer ? parseAnswerValue(answer.value) : "";
    });

    const nonEmpty = rawValues.filter((v) => v.length > 0);
    const uniqueValues = [...new Set(nonEmpty)];
    const dataType = detectDataType(rawValues, field.type);
    const distribution = computeDistribution(rawValues);
    const outliers = detectOutliers(rawValues, dataType);

    const mode = distribution.length > 0 ? distribution[0].value : null;
    let avg: number | null = null;
    let min: string | null = null;
    let max: string | null = null;

    if (dataType === "number") {
      const nums = nonEmpty.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        avg = Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 100) / 100;
        min = String(Math.min(...nums));
        max = String(Math.max(...nums));
      }
    }

    if (dataType === "rating") {
      const nums = nonEmpty.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        avg = Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 100) / 100;
        min = String(Math.min(...nums));
        max = String(Math.max(...nums));
      }
    }

    const suggestions: string[] = [];
    if (nonEmpty.length === 0) suggestions.push("No data collected yet");
    if (nonEmpty.length > 0 && nonEmpty.length < submissions.length * 0.5) {
      suggestions.push(`Low response rate (${Math.round((nonEmpty.length / submissions.length) * 100)}%)`);
    }
    if (uniqueValues.length === 1 && nonEmpty.length > 1) {
      suggestions.push("All responses are identical");
    }
    if (outliers.length > 0) {
      suggestions.push(`${outliers.length} outlier${outliers.length > 1 ? "s" : ""} detected`);
    }
    if (dataType === "text" && nonEmpty.length > 5) {
      const avgLen = nonEmpty.reduce((s, v) => s + v.length, 0) / nonEmpty.length;
      if (avgLen > 200) suggestions.push("Long text responses — consider summarizing");
    }

    return {
      fieldId: field.id,
      title: field.title,
      type: field.type,
      dataType,
      totalCount: submissions.length,
      filledCount: nonEmpty.length,
      emptyCount: submissions.length - nonEmpty.length,
      fillRate: submissions.length > 0 ? Math.round((nonEmpty.length / submissions.length) * 100) : 0,
      uniqueCount: uniqueValues.length,
      mode,
      avg,
      min,
      max,
      distribution,
      outliers,
      suggestions,
    };
  });

  const totalCells = columns.length * submissions.length;
  const filledCells = columns.reduce((s, c) => s + c.filledCount, 0);
  const overallFillRate = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;

  const qualityScore = Math.round(
    overallFillRate * 0.4 +
    (columns.filter((c) => c.uniqueCount > 1).length / Math.max(columns.length, 1)) * 30 +
    (columns.filter((c) => c.suggestions.length === 0).length / Math.max(columns.length, 1)) * 30
  );

  const summary: string[] = [];
  if (submissions.length === 0) summary.push("No submissions yet");
  else {
    summary.push(`${submissions.length} total submission${submissions.length !== 1 ? "s" : ""}`);
    summary.push(`${overallFillRate}% overall completion rate`);
    const topField = columns.reduce((best, c) => c.fillRate > best.fillRate ? c : best, columns[0]);
    if (topField) summary.push(`Best field: "${topField.title}" (${topField.fillRate}% filled)`);
    const worstField = columns.reduce((worst, c) => c.fillRate < worst.fillRate ? c : worst, columns[0]);
    if (worstField && worstField.fillRate < 80) summary.push(`Needs attention: "${worstField.title}" (${worstField.fillRate}% filled)`);
    const outlierCols = columns.filter((c) => c.outliers.length > 0);
    if (outlierCols.length > 0) summary.push(`${outlierCols.length} column${outlierCols.length > 1 ? "s" : ""} with outliers`);
  }

  return { columns, totalRows: submissions.length, overallFillRate, summary, qualityScore };
}

export { parseAnswerValue, formatSmart };
