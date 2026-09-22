import React from "react";
import HomePage from "../../containers/home-page";
import JourneyPage from "../../containers/journey-page";
import TravelPage from "../../containers/travel-page";
import { HomeRoute, JourneyRoute, RouteMeta, TravelRoute } from "./routes";

export type PageMeta = RouteMeta & {
  Page: React.ElementType;
};

const Home: PageMeta = {
  ...HomeRoute,
  Page: HomePage,
};

const Journey: PageMeta = {
  ...JourneyRoute,
  Page: JourneyPage,
};

const Travel: PageMeta = {
  ...TravelRoute,
  Page: TravelPage,
};

const AllValues = [Home, Journey, Travel];

const PageType = {
  Home: Home,
  Experience: Journey,
  Travel: Travel,
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
