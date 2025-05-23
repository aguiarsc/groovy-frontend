/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Macchiato color scheme
        macchiato: {
          rosewater: '#f4dbd6',
          flamingo: '#f0c6c6',
          pink: '#f5bde6',
          mauve: '#c6a0f6',
          red: '#ed8796',
          maroon: '#ee99a0',
          peach: '#f5a97f',
          yellow: '#eed49f',
          green: '#a6da95',
          teal: '#8bd5ca',
          sky: '#91d7e3',
          sapphire: '#7dc4e4',
          blue: '#8aadf4',
          lavender: '#b7bdf8',
          text: '#cad3f5',
          subtext1: '#b8c0e0',
          subtext0: '#a5adcb',
          overlay2: '#939ab7',
          overlay1: '#8087a2',
          overlay0: '#6e738d',
          surface2: '#5b6078',
          surface1: '#494d64',
          surface0: '#363a4f',
          base: '#24273a',
          mantle: '#1e2030',
          crust: '#181926',
        },
      },
      boxShadow: {
        'neumorphic-light': '6px 6px 12px rgba(0, 0, 0, 0.25), -6px -6px 12px rgba(255, 255, 255, 0.08)',
        'neumorphic-dark': '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.06)',
        'neumorphic-pressed': 'inset 6px 6px 12px rgba(0, 0, 0, 0.35), inset -6px -6px 12px rgba(255, 255, 255, 0.08)',
        'neumorphic-hover': '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.07)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
  // To ensure backward compatibility
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Colors directly accessible in the theme
  corePlugins: {
    textColor: true,
    backgroundColor: true,
    borderColor: true,
  }
}