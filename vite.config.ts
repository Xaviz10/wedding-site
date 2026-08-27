import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const websiteUrl = (env.VITE_WEBSITE_URL ?? "").replace(/\/$/, "");

  return {
    base: "/wedding-site/",
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "website-url-html",
        transformIndexHtml(html) {
          return html.replaceAll("__WEBSITE_URL__", websiteUrl);
        },
      },
    ],
  };
});
