import React from "react";
import { makeStyles, Theme, Container, AppBar } from "@material-ui/core";

import Copyright from "../copyright";
import SocialLinks from "../social-links";

type PageFooterProps = {};

const PageFooter = (props: PageFooterProps) => {
  const classes = useStyles();
  return (
    <AppBar color="inherit" position="sticky" className={classes.root}>
      <Container className={classes.container}>
        <Copyright />
        <SocialLinks />
      </Container>
    </AppBar>
  );
};

export default PageFooter;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: "auto",
    height: "4rem",
    padding: "0% 1rem",
  },
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
