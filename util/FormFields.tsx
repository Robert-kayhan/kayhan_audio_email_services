// utils/userFormFields.ts
import { FormField } from "@/util/interface";

export const userFormFields: FormField[] = [
  { name: "firstname", label: "First Name", type: "text", required: true },
  { name: "lastname", label: "Last Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "address", label: "Address", type: "text" },
];
