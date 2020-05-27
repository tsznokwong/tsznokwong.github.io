import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  makeStyles,
  Theme,
  Container,
  AppBar,
  Slide,
  useScrollTrigger,
} from "@material-ui/core";

import "./app.css";
import * as PageType from "../../types/page-type";
import PageMenu from "../../components/page-menu";
import PageTitle from "../../components/page-title";
import { usePage, PageContext } from "./app-hooks";

const App = () => {
  const pageContext = usePage();
  const classes = useStyles();
  const trigger = useScrollTrigger();
  return (
    <PageContext.Provider value={pageContext}>
      <div className={classes.root}>
        <Slide appear={false} direction="down" in={!trigger}>
          <AppBar color="inherit" position="sticky">
            <Container className={classes.headerRow}>
              <PageTitle />

              <PageMenu />
            </Container>
          </AppBar>
        </Slide>

        <Switch>
          {pageContext.pages.map((page) => (
            <Route exact={page.exactPath} path={page.path} key={page.path}>
              <Container className={classes.page}>{page.element}</Container>
            </Route>
          ))}
          <Redirect to={PageType.Home.path} />
        </Switch>
      </div>
    </PageContext.Provider>
  );
};

export default App;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center",
  },
  headerRow: {
    height: "4rem",
    padding: "0% 1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  page: {
    padding: "0% 1rem",
  },
}));
