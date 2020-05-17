import React from "react";
import { Tabs, Tab } from "@material-ui/core";

import "./page-menu.css";
import * as PageType from "../../types/page-type";
import { Link } from "react-router-dom";

type PageMenuProps = {
  pages: PageType.PageMeta[];
  currentPage: PageType.PageMeta;
  onPageChange: (page: PageType.PageMeta) => void;
};

const PageMenu = (props: PageMenuProps) => {
  const { currentPage, onPageChange, pages } = props;

  return (
    <Tabs
      value={currentPage}
      onChange={(event, newValue) => {
        onPageChange(newValue);
      }}
      indicatorColor="primary"
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
          label={page.title}
          value={page}
          key={page.path}
          component={Link}
          to={page.path}
          disableRipple
        />
      ))}
    </Tabs>
  );
};

export default PageMenu;
