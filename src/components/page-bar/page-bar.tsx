import React from "react";
import {
  Slide,
  AppBar,
  Container,
  makeStyles,
  Theme,
  useScrollTrigger,
} from "@material-ui/core";

import PageTitle from "../page-title";
import PageMenu from "../page-menu";

type PageBarProps = {};

const PageBar = (props: PageBarProps) => {
  const classes = useStyles();
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar color="inherit" position="sticky">
        <Container className={classes.root}>
          <PageTitle />

          <PageMenu />
        </Container>
      </AppBar>
    </Slide>
  );
};

export default PageBar;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "4rem",
    padding: "0% 1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
