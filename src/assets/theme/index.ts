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
    h3: {
      fontSize: "2rem",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.8rem",
      fontWeight: 300,
    },
    h5: {
      fontSize: "1.6rem",
      fontWeight: 200,
    },
  },
  spacing: 8,
});

theme = responsiveFontSizes(theme);

export default theme;
