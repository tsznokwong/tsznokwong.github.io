import React from "react";
import {
  makeStyles,
  Theme,
  useScrollTrigger,
  Zoom,
  Fab,
} from "@material-ui/core";
import { goToAnchor } from "react-scrollable-anchor";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

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
          goToAnchor("top");
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
    bottom: "calc(env(safe-area-inset-bottom) + 2rem)",
    right: "2rem",
    zIndex: 2000,
  },
}));
