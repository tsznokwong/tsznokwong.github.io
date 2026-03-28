import React, { useContext } from "react";
import { Box, Typography, Fade, Divider, useTheme } from "@mui/material";

import PageType from "../../types/page-type";
import { PageContext } from "../../containers/app/app-hooks";

type PageTitleProps = {};

const PageTitle = (props: PageTitleProps) => {
  const { currentPage, title } = useContext(PageContext);
  const theme = useTheme();
  const showSubtitle = currentPage !== PageType.Home;

  const rootSx = {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    height: "50%",
    gap: theme.spacing(2),
  };

  const subtitleSx = {
    color: theme.palette.primary.main,
  };

  return (
    <Box sx={rootSx}>
      <Typography variant="h3">{title}</Typography>
      <Fade in={showSubtitle}>
        <Divider orientation="vertical" variant="middle" />
      </Fade>
      <Fade in={showSubtitle}>
        <Typography sx={subtitleSx} variant="h5">
          {showSubtitle ? currentPage.title : ""}
        </Typography>
      </Fade>
    </Box>
  );
};

export default PageTitle;
