import React, { useState } from "react";
import PageMenu from "../../components/page-menu";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Grid } from "@material-ui/core";

import "./app.css";
import * as PageType from "../../types/page-type";

const pages: PageType.PageMeta[] = [PageType.Home, PageType.Test];

const App = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(
    PageType.fromPath(location.pathname)
  );

  return (
    <div className="App">
      <Grid
        className="PageHeader"
        direction="row"
        justify="space-between"
        alignItems="center"
        container
      >
        <h2>Tsz Nok Wong</h2>
        <PageMenu
          pages={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Grid>
      <Switch>
        {pages.map((page) => (
          <Route exact={page.exactPath} path={page.path} key={page.path}>
            {page.element}
          </Route>
        ))}
        <Redirect to={PageType.Home.path} />
      </Switch>
    </div>
  );
};

export default App;
