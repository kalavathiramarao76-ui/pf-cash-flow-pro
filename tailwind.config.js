module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        secondary: "#f1c40f",
        success: "#2ecc71",
        danger: "#e74c3c",
        warning: "#f7dc6f",
        info: "#3498db",
      },
    },
  },
  plugins: [],
};