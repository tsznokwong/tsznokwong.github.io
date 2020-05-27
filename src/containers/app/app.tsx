import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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
import { usePage, PageContext } from "./app-hooks";

const title = "Joshua";

const App = () => {
  const pageContext = usePage(title);
  const classes = useStyles();
  const trigger = useScrollTrigger();
  return (
    <PageContext.Provider value={pageContext}>
      <div className={classes.root}>
        <Slide appear={false} direction="down" in={!trigger}>
          <AppBar color="inherit" position="sticky">
            <Container className={classes.headerRow}>
              <Box className={classes.titleBox}>
                <Box paddingX={2}>
                  <Typography variant="h3">{title}</Typography>
                </Box>
                <Fade in={pageContext.currentPage !== PageType.Home}>
                  <Box paddingX={2} borderLeft={1} borderColor="divider">
                    <Typography className={classes.subtitle} variant="h5">
                      {pageContext.currentPage !== PageType.Home
                        ? pageContext.currentPage.title
                        : ""}
                    </Typography>
                  </Box>
                </Fade>
              </Box>

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
