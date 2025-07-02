// types/FormField.ts
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "number"
  | "email"
  | "password";

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select or radio
  placeholder?: string;
  required?: boolean;
};
export interface User {
    accessor?:any;
  id?: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
}
