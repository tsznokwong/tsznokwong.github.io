import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import PageType from "../../types/page-type";
import PageBar from "../../components/page-bar";
import PageFooter from "../../components/page-footer";
import { usePage, PageContext } from "./app-hooks";
import ScrollToTop from "../../components/scroll-to-top";

const App = () => {
  const pageContext = usePage();

  const rootSx = {
    textAlign: "center" as const,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  };

  return (
    <PageContext.Provider value={pageContext}>
      <Box sx={rootSx}>
        <PageBar />
        <Routes>
          {pageContext.pages.map((page) => (
            <Route
              path={page.path}
              key={page.path}
              element={<page.Page />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to={PageType.Home.path} replace />}
          />
        </Routes>
        <ScrollToTop />
        <PageFooter />
      </Box>
    </PageContext.Provider>
  );
};

export default App;
