/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {
      colors:{ 'anti-flash_white': { DEFAULT: '#eaebed', 100: '#2b2e33', 200: '#565b65', 300: '#848a96', 400: '#b6bac1', 500: '#eaebed', 600: '#edeef0', 700: '#f2f2f4', 800: '#f6f7f7', 900: '#fbfbfb' }, 'cerulean': { DEFAULT: '#006989', 100: '#00151c', 200: '#002a37', 300: '#003f53', 400: '#00546e', 500: '#006989', 600: '#00a3d4', 700: '#20cbff', 800: '#6adcff', 900: '#b5eeff' }, 'cadet_gray': { DEFAULT: '#a3bac3', 100: '#1c272b', 200: '#384e56', 300: '#557582', 400: '#7799a6', 500: '#a3bac3', 600: '#b5c7cf', 700: '#c7d5db', 800: '#dae3e7', 900: '#ecf1f3' }, 'cerulean': { DEFAULT: '#007090', 100: '#00161d', 200: '#002d39', 300: '#004356', 400: '#005972', 500: '#007090', 600: '#00a9d8', 700: '#23cfff', 800: '#6cdfff', 900: '#b6efff' }, 'moonstone': { DEFAULT: '#01a7c2', 100: '#002127', 200: '#00434d', 300: '#016474', 400: '#01869a', 500: '#01a7c2', 600: '#03dcfe', 700: '#42e5fe', 800: '#81eefe', 900: '#c0f6ff' } }
    },
  },
  plugins: [],
}

