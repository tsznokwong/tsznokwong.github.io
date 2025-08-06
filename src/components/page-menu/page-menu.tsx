import React, { useContext } from "react";
import { Tabs, Tab } from "@material-ui/core";
import { Theme, makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";
import { blueGrey } from "@material-ui/core/colors";
import { PageContext } from "../../containers/app/app-hooks";

type PageMenuProps = {};

const PageMenu = (props: PageMenuProps) => {
  const { pages, currentPage, onPageChange } = useContext(PageContext);
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
  selected: {},
  tab: {
    minWidth: 80,
    color: blueGrey[200],
    fontWeight: theme.typography.fontWeightRegular as any,
    "&:hover": {
      color: theme.palette.primary.light,
      opacity: 1,
    },
    "&$selected": {
      color: theme.palette.primary.main,
    },
    "&:focus": {
      color: theme.palette.primary.main,
    },
  },
}));
