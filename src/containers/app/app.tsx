import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core";

import PageType from "../../types/page-type";
import PageBar from "../../components/page-bar";
import PageFooter from "../../components/page-footer";
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
              <page.Page />
            </Route>
          ))}
          <Redirect to={PageType.Home.path} />
        </Switch>
        <PageFooter />
      </div>
    </PageContext.Provider>
  );
};

export default App;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));
