import journeyData from "../../assets/data/journey-page.json";
import travelData from "../../assets/data/travel-page.json";

// Route metadata without page components, so the build can read it to write
// per-route HTML for link previews.

export type RouteMeta = {
  title: string;
  path: string;
  exactPath: boolean;
  description: string;
};

export const SITE_TITLE = "Joshua";
export const SITE_URL = "https://tsznokwong.github.io";

export const HomeRoute: RouteMeta = {
  title: "Home",
  path: "/",
  exactPath: true,
  description: "Hello world, I'm Joshua! Welcome to my personal web.",
};

export const JourneyRoute: RouteMeta = {
  title: "Journey",
  path: "/journey",
  exactPath: false,
  description: journeyData.subtitle,
};

export const TravelRoute: RouteMeta = {
  title: "Travel",
  path: "/travel",
  exactPath: false,
  description: travelData.subtitle,
};

export const Routes = [HomeRoute, JourneyRoute, TravelRoute];

export const documentTitle = (route: Pick<RouteMeta, "path" | "title">): string =>
  route.path === HomeRoute.path ? SITE_TITLE : `${SITE_TITLE} | ${route.title}`;

// GitHub Pages serves travel/index.html at /travel/, so that is the canonical URL.
export const routeUrl = (path: string): string =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
