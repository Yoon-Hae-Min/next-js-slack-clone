/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        focusInput: '0 0 0 1px rgba(29,155,209,1), 0 0 0 5px rgba(29,155,209,0.3)',
      },
    },
  },
  plugins: [],
};
