/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      purple: "#AD1FEA",
      blue: "#4661E6",
      darkerblue: "#3A4374",
      darkblue: "#4661E6",
      cyan: "#62BCFA",
      salmon: "#F49F85",
      darkgray: "#647196",
      gray: "#F2F4FF",
      lightgray: "#F7F8FD",
      red: "#D73737"
    },

    fontSize: {
      "2xl": ["24px", { lineHeight: "35px", letterSpacing: "-0.33" }],
      xl: ["20px", { lineHeight: "29px", letterSpacing: "-0.25" }],
      lg: ["18px", { lineHeight: "26px", letterSpacing: "-0.25" }],
      normal: ["16px", { lineHeight: "23px" }],
      sm: ["15px", { lineHeight: "22px" }],
      xs: ["14px", { lineHeight: "20px", letterSpacing: "-0.2" }],
      "2xs": ["13px", { lineHeight: "19px" }]
    },
    fontFamily: {
      jost: ["Jost", "sans-serif"]
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      normal: 400
    },
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")],
  //enables chrome devTools color picker
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false
  },
  important: true
};
