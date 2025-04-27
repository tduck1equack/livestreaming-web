import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootPrettierConfig = JSON.parse(
  fs.readFileSync(resolve(__dirname, "../../.prettierrc"), "utf8"),
);

export default {
  ...rootPrettierConfig,
  plugins: ["@shopify/prettier-plugin-liquid", "prettier-plugin-tailwindcss"],
};
