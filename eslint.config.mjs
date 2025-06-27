import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // ✅ Allow `any` type
    //   "@typescript-eslint/no-unsafe-function-type": "off", // ✅ Allow unsafe function types
      // "@typescript-eslint/no-unused-vars": "warn", // ⚠️ Warn instead of error
        "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-vars": "off",
     "react/no-unescaped-entities": "off",
     "react-hooks/rules-of-hooks": "off",
         "react/display-name": "off"
    },
  },
];

export default eslintConfig;
