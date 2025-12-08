import { createTheme, responsiveFontSizes, adaptV4Theme } from "@mui/material/styles";

let theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: "#0b0767",
    },
    secondary: {
      main: "#f6d198",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.4rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.8rem",
      fontWeight: 300,
    },
    h5: {
      fontSize: "1.6rem",
      fontWeight: 200,
    },
    body1: {
      fontSize: "1.4rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "1rem",
    },
  },
  spacing: 8,
}));

theme = responsiveFontSizes(theme);

export default theme;
