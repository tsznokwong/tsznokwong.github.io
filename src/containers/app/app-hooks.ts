import { useState, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import * as PageType from "../../types/page-type";

export interface IPageContext {
  pages: PageType.PageMeta[];
  currentPage: PageType.PageMeta;
  onPageChange: (page: PageType.PageMeta) => void;
}

export const DefaultPageContext = {
  pages: [PageType.Home, PageType.Study, PageType.Job, PageType.Contact],
  currentPage: PageType.Home,
  onPageChange: (page: PageType.PageMeta) => {},
};

export const PageContext = createContext(DefaultPageContext);

export const usePage = (title: string): IPageContext => {
  const location = useLocation();
  const [page, setPage] = useState(PageType.fromPath(location.pathname));
  const pages = DefaultPageContext.pages;
  useEffect(() => {
    if (page !== PageType.Home) {
      document.title = `${title} | ${page.title}`;
    } else {
      document.title = title;
    }
  }, [page]);
  return {
    pages,
    currentPage: page,
    onPageChange: setPage,
  };
};
