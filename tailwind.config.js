/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,htm,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        primary: "#7761DD",
        primary2: "#8F7EE7",
        textmain: "#E3E6E6",
        textsecondary: "#868A8D",
        texttertiary: "#3B3B3D",
        backgroundmain: "#1D1D1D",
        backgroundsecondary: "#181818",
        backgroundblock: "#2C2C2C",
        selected: "#323232",
      },
    },
  },
  plugins: [],
};
