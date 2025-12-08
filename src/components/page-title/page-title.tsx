import React, { useContext } from "react";
import { Box, Typography, Fade, Theme, Divider } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import PageType from "../../types/page-type";
import { PageContext } from "../../containers/app/app-hooks";

type PageTitleProps = {};

const PageTitle = (props: PageTitleProps) => {
  const { currentPage, title } = useContext(PageContext);
  const classes = useStyles();
  const showSubtitle = currentPage !== PageType.Home;
  return (
    <Box className={classes.root}>
      <Typography variant="h3">{title}</Typography>
      <Fade in={showSubtitle}>
        <Divider orientation="vertical" variant="middle" />
      </Fade>
      <Fade in={showSubtitle}>
        <Typography className={classes.subtitle} variant="h5">
          {showSubtitle ? currentPage.title : ""}
        </Typography>
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
    height: "50%",
  },
  subtitle: {
    color: theme.palette.primary.main,
  },
}));
