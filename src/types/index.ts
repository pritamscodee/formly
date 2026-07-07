export type FieldType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "rating"
  | "opinion_scale"
  | "yes_no"
  | "email"
  | "phone"
  | "website"
  | "date"
  | "number"
  | "file_upload";

export interface FieldOption {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  formId: string;
  type: FieldType;
  title: string;
  description: string;
  required: boolean;
  order: number;
  options: FieldOption[];
  other: boolean;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  published: boolean;
  userId: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionData {
  id: string;
  formId: string;
  respondentEmail?: string;
  answers: { fieldId: string; value: string }[];
  createdAt: Date;
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  multiple_choice: "Multiple Choice",
  checkboxes: "Checkboxes",
  dropdown: "Dropdown",
  rating: "Rating",
  opinion_scale: "Opinion Scale",
  yes_no: "Yes/No",
  email: "Email",
  phone: "Phone",
  website: "Website",
  date: "Date",
  number: "Number",
  file_upload: "File Upload",
};
