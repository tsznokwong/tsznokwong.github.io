import { useScrollTrigger } from "@mui/material";

export const usePageBarTrigger = (): boolean => {
  const trigger = useScrollTrigger();
  return !trigger;
};
