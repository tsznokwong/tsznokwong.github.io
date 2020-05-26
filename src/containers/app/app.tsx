import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import {
  makeStyles,
  Theme,
  Box,
  Typography,
  Container,
  Fade,
  AppBar,
  Slide,
  useScrollTrigger,
} from "@material-ui/core";

import "./app.css";
import * as PageType from "../../types/page-type";
import PageMenu from "../../components/page-menu";

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
  const trigger = useScrollTrigger();
  return (
    <div className={classes.root}>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar color="inherit" position="sticky">
          <Container className={classes.headerRow}>
            <Box className={classes.titleBox}>
              <Box paddingX={2}>
                <Typography variant="h3">{title}</Typography>
              </Box>
              <Fade in={currentPage !== PageType.Home}>
                <Box paddingX={2} borderLeft={1} borderColor="divider">
                  <Typography className={classes.subtitle} variant="h5">
                    {currentPage !== PageType.Home ? currentPage.title : ""}
                  </Typography>
                </Box>
              </Fade>
            </Box>

            <PageMenu
              pages={pages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Container>
        </AppBar>
      </Slide>

      <Switch>
        {pages.map((page) => (
          <Route exact={page.exactPath} path={page.path} key={page.path}>
            <Container className={classes.page}>{page.element}</Container>
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
  page: {
    padding: "1rem",
  },
}));
