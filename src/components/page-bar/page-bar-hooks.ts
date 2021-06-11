import { useScrollTrigger } from "@material-ui/core";

export const usePageBarTrigger = (): boolean => {
  const trigger = useScrollTrigger();
  return !trigger;
};
