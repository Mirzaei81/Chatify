const {nextui} = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{tsx,ts,jsx,js}",
    "./node_modules/@nextui-org/theme/dist/components/(navbar|skeleton|button|link).js",
  ],
  theme: {
    extend: {
      fontFamily:{
       Cheveuxdange:
        "CheveuxdangeRegular",
       Pencil:
        "PencilRegular",
      },
      colors: {
        'sunglow': { DEFAULT: '#FECD43', 100: '#402f00', 200: '#805e01', 300: '#c08d01', 400: '#febb03', 500: '#fecd43', 600: '#fed669', 700: '#fee18e', 800: '#ffebb4', 900: '#fff5d9' },
        'glaucous': { DEFAULT: '#677ABC', 100: '#121728', 200: '#232d51', 300: '#354479', 400: '#475ba2', 500: '#677abc', 600: '#8594c9', 700: '#a4afd7', 800: '#c2c9e4', 900: '#e1e4f2' } 
      }
    },
    darkMode: "class",
    plugins: [nextui()],
  }
}
//{
//      themes:{
//        dark:{
//          colors:{
//            background:'#FECD43',
//            foreground: '#677ABC',
//            primary:{
//              foreground:"#FFFFFF",
//              DEFAULT: '#FECD43', 100: '#402f00', 200: '#805e01',
//              300: '#c08d01', 400: '#febb03', 500: '#fecd43', 600: '#fed669', 
//              700: '#fee18e', 800: '#ffebb4', 900: '#fff5d9' },
//            secondary:{
//              DEFAULT: '#677ABC', 100: '#121728', 200: '#232d51',
//              300: '#354479', 400: '#475ba2', 500: '#677abc', 600:
//              '#8594c9', 700: '#a4afd7', 800: '#c2c9e4', 900: '#e1e4f2' } 
//          },
//        },
//      },
//      mytheme: {
//          // custom theme
//          extend: "dark",
//          colors: {
//            primary: {
//              DEFAULT: "#BEF264",
//              foreground: "#000000",
//            },
//            focus: "#BEF264",
//          },
//        },
//    })
//
