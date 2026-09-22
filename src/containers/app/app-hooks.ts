import { useState, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PageType, { PageMeta } from "../../types/page-type";
import { SITE_TITLE, documentTitle } from "../../types/page-type/routes";

export interface IPageContext {
  pages: PageMeta[];
  currentPage: PageMeta;
  onPageChange: (page: PageMeta) => void;
  title: string;
}

export const DefaultPageContext = {
  pages: [PageType.Home, PageType.Experience, PageType.Travel],
  currentPage: PageType.Home,
  onPageChange: (page: PageMeta) => { },
  title: SITE_TITLE,
};

export const PageContext = createContext(DefaultPageContext);

export const usePage = (): IPageContext => {
  const location = useLocation();
  const [page, setPage] = useState(PageType.fromPath(location.pathname));
  const { pages, title } = DefaultPageContext;
  useEffect(() => {
    document.title = documentTitle(page);
  }, [page]);
  return {
    pages,
    currentPage: page,
    onPageChange: setPage,
    title,
  };
};
