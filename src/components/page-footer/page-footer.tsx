import React from "react";
import { Theme, Container, AppBar } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

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
    padding: "0% 1rem",
    [theme.breakpoints.down('md')]: {
      height: "calc(env(safe-area-inset-bottom) + 6rem)",
    },
    [theme.breakpoints.up("sm")]: {
      height: "4rem",
    },
    paddingBottom: "env(safe-area-inset-bottom)",
  },
  container: {
    height: "100%",
    display: "flex",
    [theme.breakpoints.down('md')]: {
      flexDirection: "column-reverse",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
}));
