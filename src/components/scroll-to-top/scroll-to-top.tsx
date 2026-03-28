import React from "react";
import { useScrollTrigger, Zoom, Fab, useTheme, Box } from "@mui/material";
import { animateScroll as scroll } from "react-scroll";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type ScrollToTopProps = {};

const ScrollToTop = (props: ScrollToTopProps) => {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  });

  const rootSx = {
    position: "fixed" as const,
    right: "2rem",
    zIndex: 2000,
    [theme.breakpoints.down('md')]: {
      bottom: "calc(env(safe-area-inset-bottom) + 6.5rem)",
    },
    [theme.breakpoints.up('md')]: {
      bottom: "calc(env(safe-area-inset-bottom) + 5rem)",
    },
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={() => {
          scroll.scrollToTop();
        }}
        role="presentation"
        sx={rootSx}
      >
        <Fab color="secondary" aria-label="scroll back to top">
          <KeyboardArrowUpIcon fontSize="large" />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTop;
