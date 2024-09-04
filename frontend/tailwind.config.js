/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      fontFamily: {
        'protest': ["Protest Guerrilla", "sans-serif"],
        'poppins': ['Poppins', 'sans-serif'],
        'merriweather' : ['Merriweather', 'serif'],
        'playwrite' : ['Playwrite CU', 'sans-serif'],
        'lora' : ['Lora', 'serif'],
        'nerko' : ['Nerko One', 'cursive'],

      },
    },
  },
  plugins: [],
}

