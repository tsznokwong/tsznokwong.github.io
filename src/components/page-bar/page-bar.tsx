import React, { useState } from "react";
import { Slide, AppBar, Container, Theme, useMediaQuery, useTheme, Button, Drawer } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";

import PageTitle from "../page-title";
import PageMenu from "../page-menu";
import PageDrawerList from "../page-drawer-list";
import { usePageBarTrigger } from "./page-bar-hooks";

type PageBarProps = {};

const PageBar = (props: PageBarProps) => {
  const theme = useTheme();
  const classes = useStyles();
  const trigger = usePageBarTrigger();
  const expandedMenu = useMediaQuery(theme.breakpoints.up("sm"));
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Slide direction="down" in={trigger} appear>
      <AppBar className={classes.root} color="transparent" position="sticky">
        <Container className={classes.bar}>
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
    padding: "0% 1rem",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  bar: {
    height: "4rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
  },
}));
