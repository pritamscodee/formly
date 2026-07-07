import { create } from "zustand";
import type { FormField, FieldType } from "@/types";

interface EditorState {
  formId: string | null;
  fields: FormField[];
  title: string;
  description: string;
  selectedFieldId: string | null;
  setFormMeta: (title: string, description: string) => void;
  setFields: (fields: FormField[]) => void;
  setSelectedFieldId: (id: string | null) => void;
  addField: (type: FieldType) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
}

let fieldCounter = 0;

function createField(type: FieldType, order: number): FormField {
  fieldCounter++;
  return {
    id: `new_${Date.now()}_${fieldCounter}`,
    formId: "",
    type,
    title: "",
    description: "",
    required: false,
    order,
    options:
      type === "multiple_choice" ||
      type === "checkboxes" ||
      type === "dropdown"
        ? [
            { id: "opt_1", label: "Option 1" },
            { id: "opt_2", label: "Option 2" },
          ]
        : [],
    other: false,
  };
}

export const useEditorStore = create<EditorState>((set) => ({
  formId: null,
  fields: [],
  title: "Untitled Form",
  description: "",
  selectedFieldId: null,

  setFormMeta: (title, description) => set({ title, description }),

  setFields: (fields) => set({ fields }),

  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  addField: (type) =>
    set((state) => ({
      fields: [...state.fields, createField(type, state.fields.length)],
      selectedFieldId: null,
    })),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields
        .filter((f) => f.id !== id)
        .map((f, i) => ({ ...f, order: i })),
      selectedFieldId:
        state.selectedFieldId === id ? null : state.selectedFieldId,
    })),

  reorderFields: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        fields: result.map((f, i) => ({ ...f, order: i })),
      };
    }),

  moveField: (fromIndex, toIndex) =>
    set((state) => {
      const result = Array.from(state.fields);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return {
        fields: result.map((f, i) => ({ ...f, order: i })),
      };
    }),
}));
