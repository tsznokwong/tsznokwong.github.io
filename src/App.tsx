import React, { useState } from "react";
import PageMenu from "./component/page-menu";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

import "./App.css";
import * as PageType from "./types/page-type";
import HomePage from "./containers/home-page";
import TestPage from "./containers/test-page";

function App() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(
    PageType.fromPath(location.pathname)
  );

  return (
    <div className="App">
      Tsznok Wong's Web.
      <br />
      Please wait for updates...
      <br />
      He is working on it very soon...
      <PageMenu currentPage={currentPage} onPageChange={setCurrentPage} />
      <Switch>
        <Route exact path={PageType.Home.path}>
          <HomePage />
        </Route>
        <Route path={PageType.Test.path}>
          <TestPage />
        </Route>
        <Redirect to={PageType.Home.path} />
      </Switch>
    </div>
  );
}

export default App;
