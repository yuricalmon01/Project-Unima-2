import js from "@eslint/js";
import globals from "globals";

export default [
  // 👇 1) Ignorar arquivos/pastas antigos
  {
    ignores: [
      "sos_saude_backend/**",
    ],
  },

  // 👇 2) Regra geral pros .js do projeto
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // 👇 3) Config especial pros testes (Jest)
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
