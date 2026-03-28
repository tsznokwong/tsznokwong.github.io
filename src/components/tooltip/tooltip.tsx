import { Tooltip as MUITooltip, Theme, useTheme } from "@mui/material";
import React from "react";

interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  arrow?: boolean;
  placement?: "top" | "right" | "bottom" | "left";
  [key: string]: any;
}

const Tooltip = (props: TooltipProps) => {
  const theme = useTheme();

  const tooltipSx = {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
    "& .MuiTooltip-arrow": {
      color: theme.palette.background.paper,
    },
  };

  return <MUITooltip {...props} slotProps={{ tooltip: { sx: tooltipSx } }} />;
};

export default Tooltip;
