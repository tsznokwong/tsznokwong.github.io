import React from "react";
import HomePage from "../../containers/home-page";
import ExperiencePage from "../../containers/experience-page";
import TestPage from "../../containers/test-page";

export type PageMeta = {
  title: string;
  path: string;
  exactPath: boolean;
  Page: React.ElementType;
};

export const Home: PageMeta = {
  title: "Home",
  path: "/",
  exactPath: true,
  Page: HomePage,
};

export const Experience: PageMeta = {
  title: "Experience",
  path: "/experience",
  exactPath: false,
  Page: ExperiencePage,
};

export const Test: PageMeta = {
  title: "Test",
  path: "/test",
  exactPath: false,
  Page: TestPage,
};

export const AllValues = [Home, Experience, Test];

export function fromPath(path?: string): PageMeta {
  const meta = AllValues.filter(
    (value) => value.path === path || path?.startsWith(value.path + "/")
  );
  if (meta.length === 0) return Home;
  return meta[0];
}

export function fromTitle(title?: string): PageMeta {
  const meta = AllValues.filter((value) => value.title === title);
  if (meta.length === 0) return Home;
  return meta[0];
}
