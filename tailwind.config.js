/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#f4f6ec',
          100: '#e5eacd',
          200: '#d0db9f',
          300: '#b4c66d',
          400: '#97af44',
          500: '#7a9629',
          600: '#5c632e', // User Requested Brand Color
          700: '#485626',
          800: '#3a4421',
          900: '#31391e',
        },
        neutral: {
          50: '#f6f3ec',
          100: '#ebe7db',
          200: '#d6d0b7',
          300: '#c2b993',
          400: '#ada26f',
          500: '#998b4b',
          600: '#7a6f3c',
          700: '#5b552d',
          800: '#3c3a1f',
          900: '#1d1f0f',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#bcbcbc',
          400: '#a0a0a0',
          500: '#828282',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
        },
      },
      aspectRatio: {
        'video': '3 / 4',
      },
    },
  },
  plugins: [],
};
