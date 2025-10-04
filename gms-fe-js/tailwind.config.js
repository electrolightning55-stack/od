/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        themeGray: "$374151",
        themeYellow: "#ffc20e",
        sidebarGray: "#cfd3d4",
        formBGBlue: "#e3edf9",
        themeBlue: "#5570f1",
        formBgLightBlue: "#eef0fb",
        formBgLightGreen: "#f5fbf8",
        formButtonBlue: "#5570f1",
        formButtonBlueHover: "#435bf5",
        tableBgGray: "#f2f4f5",
      },
    },
  },
  plugins: [],
};
