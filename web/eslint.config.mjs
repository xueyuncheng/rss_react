import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
    ...nextCoreWebVitals,
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },

        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
        },
    }
];