export type PageMeta = {
  title: string;
  path: string;
};

export const Home: PageMeta = {
  title: "Home",
  path: "/",
};

export const Test: PageMeta = {
  title: "Test",
  path: "/test",
};

export const AllValues = [Home, Test];

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
