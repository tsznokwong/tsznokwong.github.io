import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles, Theme, Container } from "@material-ui/core";

import "./app.css";
import * as PageType from "../../types/page-type";
import PageBar from "../../components/page-bar";
import { usePage, PageContext } from "./app-hooks";

const App = () => {
  const pageContext = usePage();
  const classes = useStyles();
  return (
    <PageContext.Provider value={pageContext}>
      <div className={classes.root}>
        <PageBar />

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
  page: {
    padding: "0% 1rem",
  },
}));
