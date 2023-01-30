/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        focusInput: 'shadow-[0_0_0_1px_rgba(29,155,209,1),0_0_0_5px_rgba(29,155,209,0.3)]',
      },
    },
  },
  plugins: [],
};
