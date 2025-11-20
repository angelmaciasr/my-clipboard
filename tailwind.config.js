/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#1c1c1e",
        "app-surface": "#2c2c2e",
        "app-border": "#3a3a3c",
        "app-text": "#f5f5f7",
        "app-text-muted": "#a1a1a6",
        "app-accent": "#0a84ff",
        "app-accent-hover": "#409cff",

        //         {
        //   'app-bg': '#1c1c1e',               // fondo principal Sequoia oscuro
        //   'app-surface': '#2c2c2e',          // surface estilo “vibrancy dark”
        //   'app-border': '#3a3a3c',           // bordes suaves, poco contrastados
        //   'app-text': '#f5f5f7',             // texto primario Apple (casi blanco cálido)
        //   'app-text-muted': '#a1a1a6',       // gris secundario Sequoia
        //   'app-accent': '#0a84ff',           // azul Apple por defecto (Sequoia)
        //   'app-accent-hover': '#409cff'      // hover más vibrante tipo macOS
        // }
      },
    },
  },
  plugins: [],
};
