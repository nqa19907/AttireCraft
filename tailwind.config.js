/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: {
            DEFAULT: '#9E2A2B',
            dark: '#6E1A24',
            light: '#C44536',
            lacquer: '#B83227',
          },
          indigo: {
            DEFAULT: '#1A365D',
            dark: '#0F233D',
            light: '#2B4C7E',
            soft: '#3B608C',
          },
          gold: {
            DEFAULT: '#E0A96D',
            dark: '#B07D3E',
            light: '#F3C68F',
            royal: '#D4AF37',
          },
          paper: {
            DEFAULT: '#FAF7F2',
            warm: '#F4EFEA',
            aged: '#EDE4D8',
            card: '#FFFFFF',
          },
          charcoal: {
            DEFAULT: '#1E1E24',
            dark: '#121214',
            muted: '#4A4E69',
          },
          jade: {
            DEFAULT: '#2D6A4F',
            dark: '#1B4332',
            light: '#40916C',
          }
        }
      },
      fontFamily: {
        heritage: ['"Cinzel Decorative"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'heritage-glow': '0 4px 25px -2px rgba(158, 42, 43, 0.18)',
        'gold-glow': '0 4px 25px -2px rgba(224, 169, 109, 0.25)',
        'indigo-glow': '0 4px 25px -2px rgba(43, 76, 126, 0.2)',
      }
    },
  },
  plugins: [],
}
