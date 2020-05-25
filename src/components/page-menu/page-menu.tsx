import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { Theme, makeStyles } from "@material-ui/core/styles";

import "./page-menu.css";
import * as PageType from "../../types/page-type";
import { Link } from "react-router-dom";
import { blueGrey } from "@material-ui/core/colors";

type PageMenuProps = {
  pages: PageType.PageMeta[];
  currentPage: PageType.PageMeta;
  onPageChange: (page: PageType.PageMeta) => void;
};

const PageMenu = (props: PageMenuProps) => {
  const { currentPage, onPageChange, pages } = props;
  const classes = useStyles();
  return (
    <Tabs
      value={currentPage}
      onChange={(event, newValue) => {
        onPageChange(newValue);
      }}
      textColor="primary"
      variant="fullWidth"
      TabIndicatorProps={{
        style: {
          height: "0",
        },
      }}
    >
      {pages.map((page) => (
        <Tab
          selected={page === currentPage}
          className={classes.tab}
          disableRipple
          label={page.title}
          value={page}
          component={Link}
          to={page.path}
          key={page.path}
        />
      ))}
    </Tabs>
  );
};

export default PageMenu;

const useStyles = makeStyles((theme: Theme) => ({
  tab: {
    minWidth: 72,
    color: blueGrey[200],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.light,
      opacity: 1,
    },
    "&$selected": {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: theme.palette.primary.main,
    },
  },
}));
