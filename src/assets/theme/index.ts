import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#413c69",
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
    body2: {
      fontSize: "0.9rem",
    },
  },
  spacing: 8,
});

theme = responsiveFontSizes(theme);

export default theme;
