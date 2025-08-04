import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core";

import PageType from "../../types/page-type";
import PageBar from "../../components/page-bar";
import PageFooter from "../../components/page-footer";
import { usePage, PageContext } from "./app-hooks";
import ScrollToTop from "../../components/scroll-to-top";

const App = () => {
  const pageContext = usePage();
  const classes = useStyles();
  return (
    <PageContext.Provider value={pageContext}>
      <div className={classes.root}>
        <PageBar />
        <Routes>
          {pageContext.pages.map((page) => (
            <Route
              path={page.path}
              key={page.path}
              element={<page.Page />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to={PageType.Home.path} replace />}
          />
        </Routes>
        <ScrollToTop />
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
