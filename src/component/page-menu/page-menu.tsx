import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";

import "./page-menu.css";
import * as PageType from "../../types/page-type";
import { Link } from "react-router-dom";

type PageMenuProps = {
  currentPage: PageType.PageMeta;
  onPageChange: (page: PageType.PageMeta) => void;
};

const PageMenu = (props: PageMenuProps) => {
  const { currentPage, onPageChange } = props;

  return (
    <div>
      <Tabs
        value={currentPage}
        onChange={(event, newValue) => {
          onPageChange(newValue);
        }}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {PageType.AllValues.map((page) => (
          <Tab
            label={page.title}
            value={page}
            key={page.path}
            component={Link}
            to={page.path}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default PageMenu;
