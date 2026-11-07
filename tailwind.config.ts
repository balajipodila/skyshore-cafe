import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyx: {
          50: "#F4FBFF",
          100: "#E6F5FC",
          200: "#CDECF7",
          300: "#A6DCED",
          400: "#6FC1D8",
          500: "#3FA9C4",
          600: "#2C8AA4",
          700: "#266E85",
          800: "#235C6E",
          900: "#204E5E",
        },
        aqua: { DEFAULT: "#7FD1C0", soft: "#A7E0D4", deep: "#2A9D8F" },
        sand: { 50: "#FFF8ED", 100: "#F9EED7", 200: "#F2DDB4", 300: "#EAC88C", DEFAULT: "#E9D5B8" },
        coral: { DEFAULT: "#FF7A6B", dark: "#E85D4E", soft: "#FFA99E" },
        navy: { DEFAULT: "#12263A", soft: "#1E3A53", night: "#0B1A2B" },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(18,38,58,0.12)",
        soft: "0 12px 40px rgba(18,38,58,0.10)",
        lift: "0 16px 48px rgba(18,38,58,0.16)",
      },
      borderRadius: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
