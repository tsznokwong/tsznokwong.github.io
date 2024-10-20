import { useState, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PageType, { PageMeta } from "../../types/page-type";

export interface IPageContext {
  pages: PageMeta[];
  currentPage: PageMeta;
  onPageChange: (page: PageMeta) => void;
  title: string;
}

export const DefaultPageContext = {
  pages: [PageType.Home, PageType.Experience],
  currentPage: PageType.Home,
  onPageChange: (page: PageMeta) => {},
  title: "Joshua",
};

export const PageContext = createContext(DefaultPageContext);

export const usePage = (): IPageContext => {
  const location = useLocation();
  const [page, setPage] = useState(PageType.fromPath(location.pathname));
  const { pages, title } = DefaultPageContext;
  useEffect(() => {
    if (page !== PageType.Home) {
      document.title = `${title} | ${page.title}`;
    } else {
      document.title = title;
    }
  }, [page, title]);
  return {
    pages,
    currentPage: page,
    onPageChange: setPage,
    title,
  };
};
