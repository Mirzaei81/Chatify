const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{tsx,ts,jsx,js}",
    "./node_modules/@nextui-org/theme/dist/components/(navbar|skeleton|button|link).js",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '68': '17rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '124': '31rem',
      },
      fontFamily: {
        Cheveuxdange:
          "CheveuxdangeRegular",
        Pencil:
          "PencilRegular",
        BZiba: "BZiba",
        BZiba: ["BZiba", "sans"],
        Maktoob: ["Maktoob", "sans"],
        IranNastaliq: ["IranNastaliq", "sans"]
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
