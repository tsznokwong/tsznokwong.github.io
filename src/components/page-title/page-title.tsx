import React, { useContext } from "react";
import { Box, Typography, Fade, makeStyles, Theme } from "@material-ui/core";

import * as PageType from "../../types/page-type";
import { PageContext } from "../../containers/app/app-hooks";

type PageTitleProps = {};

const PageTitle = (props: PageTitleProps) => {
  const { currentPage, title } = useContext(PageContext);
  const classes = useStyles();
  return (
    <Box className={classes.root}>
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
  );
};

export default PageTitle;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    color: theme.palette.primary.main,
  },
}));
