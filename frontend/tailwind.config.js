/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',            // Watch the root HTML file
    './src/**/*.{js,ts,jsx,tsx}' // Watch all component files in src/
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7e22ce', // Optional: Add your brand colors if any
        secondary: '#2563eb',
        background: '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Optional: Add fonts if using
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),       // Optional: Better form styles
    require('@tailwindcss/typography'),  // Optional: Prose formatting
    require('@tailwindcss/aspect-ratio') // Optional: Responsive images/videos
  ],
};
