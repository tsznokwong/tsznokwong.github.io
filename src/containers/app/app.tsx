import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Grid, makeStyles, Theme, Box, Typography } from "@material-ui/core";

import "./app.css";
import * as PageType from "../../types/page-type";
import PageMenu from "../../components/page-menu";
import { blueGrey } from "@material-ui/core/colors";

const pages: PageType.PageMeta[] = [
  PageType.Home,
  PageType.Study,
  PageType.Job,
  PageType.Contact,
];

const title = "Joshua";

const App = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(
    PageType.fromPath(location.pathname)
  );
  const classes = useStyles();
  useEffect(() => {
    if (currentPage !== PageType.Home) {
      document.title = `${title} | ${currentPage.title}`;
    } else {
      document.title = title;
    }
  }, [currentPage]);
  return (
    <div className={classes.root}>
      <Grid className={classes.headerRow} container>
        <Box className={classes.titleBox}>
          <Box paddingX={1}>
            <Typography variant="h3">{title}</Typography>
          </Box>

          {currentPage !== PageType.Home && (
            <Box borderLeft={1} paddingX={1} borderColor={blueGrey[200]}>
              <Typography className={classes.subtitle} variant="h5">
                {currentPage.title}
              </Typography>
            </Box>
          )}
        </Box>

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
  titleBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {},
  subtitle: {
    color: theme.palette.primary.main,
  },
}));
