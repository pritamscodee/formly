import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportField {
  id: string;
  type: string;
  title: string;
}

interface ExportAnswer {
  fieldId: string;
  value: string;
}

interface ExportSubmission {
  id: string;
  channelId: string | null;
  createdAt: string;
  answers: ExportAnswer[];
}

interface ExportChannel {
  id: string;
  name: string;
}

interface ExportForm {
  title: string;
  fields: ExportField[];
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildAnswerMap(answers: ExportAnswer[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const a of answers) {
    try {
      const parsed = JSON.parse(a.value);
      map[a.fieldId] = Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
    } catch {
      map[a.fieldId] = a.value;
    }
  }
  return map;
}

export function generateCSV(
  form: ExportForm,
  submissions: ExportSubmission[],
  channels: ExportChannel[]
): string {
  const channelMap = new Map(channels.map((c) => [c.id, c.name]));
  const headers = ["Response ID", "Date", "Channel", ...form.fields.map((f) => f.title)];
  const rows = submissions.map((sub) => {
    const answerMap = buildAnswerMap(sub.answers);
    return [
      sub.id,
      new Date(sub.createdAt).toISOString(),
      sub.channelId ? channelMap.get(sub.channelId) || "Unknown" : "",
      ...form.fields.map((f) => answerMap[f.id] || ""),
    ];
  });

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return csvContent;
}

export function downloadCSV(formTitle: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${formTitle.replace(/[^a-z0-9]/gi, "_")}_responses.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generatePDF(
  form: ExportForm,
  submissions: ExportSubmission[],
  channels: ExportChannel[]
): jsPDF {
  const doc = new jsPDF({ orientation: submissions.length > 5 ? "landscape" : "portrait" });
  const channelMap = new Map(channels.map((c) => [c.id, c.name]));

  doc.setFontSize(18);
  doc.text(form.title, 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `${submissions.length} response${submissions.length !== 1 ? "s" : ""} · Exported ${new Date().toLocaleDateString()}`,
    14,
    30
  );

  const headers = [["#", "Date", "Channel", ...form.fields.map((f) => f.title)]];
  const rows = submissions.map((sub, i) => {
    const answerMap = buildAnswerMap(sub.answers);
    return [
      String(i + 1),
      new Date(sub.createdAt).toLocaleDateString(),
      sub.channelId ? channelMap.get(sub.channelId) || "Unknown" : "-",
      ...form.fields.map((f) => answerMap[f.id] || "-"),
    ];
  });

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 36,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [23, 23, 28] },
    alternateRowStyles: { fillColor: [245, 240, 232] },
    margin: { left: 14, right: 14 },
  });

  return doc;
}

export function downloadPDF(formTitle: string, doc: jsPDF) {
  doc.save(`${formTitle.replace(/[^a-z0-9]/gi, "_")}_responses.pdf`);
}

export function getCSVContent(
  form: ExportForm,
  submissions: ExportSubmission[],
  channels: ExportChannel[]
): string {
  return generateCSV(form, submissions, channels);
}

export function getPDFBytes(
  form: ExportForm,
  submissions: ExportSubmission[],
  channels: ExportChannel[]
): ArrayBuffer {
  const doc = generatePDF(form, submissions, channels);
  return doc.output("arraybuffer");
}
