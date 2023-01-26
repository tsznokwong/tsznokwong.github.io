import React from "react";
import HomePage from "../../containers/home-page";
import JourneyPage from "../../containers/journey-page";
import BlogPage from "../../containers/blog-page";
import TestPage from "../../containers/test-page";

export type PageMeta = {
  title: string;
  path: string;
  exactPath: boolean;
  Page: React.ElementType;
};

const Home: PageMeta = {
  title: "Home",
  path: "/",
  exactPath: true,
  Page: HomePage,
};

const Journey: PageMeta = {
  title: "Journey",
  path: "/journey",
  exactPath: false,
  Page: JourneyPage,
};

const Blog: PageMeta = {
  title: "Blog",
  path: "/blog",
  exactPath: false,
  Page: BlogPage,
};

const Test: PageMeta = {
  title: "Test",
  path: "/test",
  exactPath: false,
  Page: TestPage,
};

const AllValues = [Home, Journey, Blog];

const PageType = {
  Home: Home,
  Experience: Journey,
  Blog: Blog,
  Test: Test,
  AllValues: AllValues,
  fromPath(path?: string): PageMeta {
    const meta = AllValues.filter(
      (value) => value.path === path || path?.startsWith(value.path + "/")
    );
    if (meta.length === 0) return Home;
    return meta[0];
  },
  fromTitle(title?: string): PageMeta {
    const meta = AllValues.filter((value) => value.title === title);
    if (meta.length === 0) return Home;
    return meta[0];
  },
};

export default PageType;
