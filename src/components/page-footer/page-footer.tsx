import React from "react";
import { Container, AppBar, useTheme } from "@mui/material";

import Copyright from "../copyright";
import SocialLinks from "../social-links";

type PageFooterProps = {};

const PageFooter = (props: PageFooterProps) => {
  const theme = useTheme();

  const rootSx = {
    marginTop: "auto",
    padding: "0% 1rem",
    paddingBottom: "env(safe-area-inset-bottom)",
    [theme.breakpoints.down('md')]: {
      height: "calc(env(safe-area-inset-bottom) + 6rem)",
    },
    [theme.breakpoints.up("sm")]: {
      height: "4rem",
    },
  };

  const containerSx = {
    height: "100%",
    display: "flex",
    [theme.breakpoints.down('md')]: {
      flexDirection: "column-reverse" as const,
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "center",
    },
  };

  return (
    <AppBar color="inherit" position="sticky" sx={rootSx}>
      <Container sx={containerSx}>
        <Copyright />
        <SocialLinks />
      </Container>
    </AppBar>
  );
};

export default PageFooter;
