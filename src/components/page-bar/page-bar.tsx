import React, { useState } from "react";
import {
  Slide,
  AppBar,
  Container,
  makeStyles,
  Theme,
  useScrollTrigger,
  useMediaQuery,
  useTheme,
  Button,
  Drawer,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import PageTitle from "../page-title";
import PageMenu from "../page-menu";
import PageDrawerList from "../page-drawer-list";

type PageBarProps = {};

const PageBar = (props: PageBarProps) => {
  const theme = useTheme();
  const classes = useStyles();
  const trigger = useScrollTrigger();
  const expandedMenu = useMediaQuery(theme.breakpoints.up("sm"));
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar color="inherit" position="sticky">
        <Container className={classes.root}>
          <PageTitle />
          {expandedMenu ? (
            <PageMenu />
          ) : (
            <Button color="primary" onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </Button>
          )}
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <PageDrawerList onItemClick={() => setOpenDrawer(false)} />
          </Drawer>
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
