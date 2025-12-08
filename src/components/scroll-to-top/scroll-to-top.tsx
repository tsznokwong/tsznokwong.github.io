import React from "react";
import { Theme, useScrollTrigger, Zoom, Fab } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { animateScroll as scroll } from "react-scroll";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type ScrollToTopProps = {};

const ScrollToTop = (props: ScrollToTopProps) => {
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  });
  return (
    <Zoom in={trigger}>
      <div
        onClick={() => {
          scroll.scrollToTop();
        }}
        role="presentation"
        className={classes.root}
      >
        <Fab color="secondary" aria-label="scroll back to top">
          <KeyboardArrowUpIcon fontSize="large" />
        </Fab>
      </div>
    </Zoom>
  );
};

export default ScrollToTop;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    right: "2rem",
    zIndex: 2000,
    [theme.breakpoints.down('md')]: {
      bottom: "calc(env(safe-area-inset-bottom) + 6.5rem)",
    },
    [theme.breakpoints.up('md')]: {
      bottom: "calc(env(safe-area-inset-bottom) + 5rem)",
    },
  },
}));
