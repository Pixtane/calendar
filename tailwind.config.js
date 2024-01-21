/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,htm,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        success: "#01E676",
        danger: "#FF3B30",
        primary: "#7761DD",
        primary2: "#8F7EE7",
        textmain: "#E3E6E6",
        textsecondary: "#767A7D",
        texttertiary: "#3B3B3B",
        backgroundmain: "#1D1D1D",
        backgroundsecondary: "#181818",
        backgroundblock: "#2C2C2C",
        selected: "#323232",
        selected2: "#4D4D4D",
        selected3: "#6D6D6D",
      },
    },
  },
  plugins: [],
};
