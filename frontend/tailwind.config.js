/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBgColor: "#333", // Light, neutral background for main sections
        altBgColor: "#ccc", // Crisp white for alternate sections
        mainTextColor: "#333333", // Dark gray for legible main text
        altTextColor: "#555555", // Medium gray for alternate text
        mainButtonColor: "#4CAF50", // Calming green for buttons
        altButtonColor: "#FF5722", // Vibrant orange for alternate buttons
        hoverColor: "#3E8E41", // Darker green for button hover states
        textHover: "#3b82f6" // Bright blue for text hover effects
      }
    },
  },
  plugins: [],
}