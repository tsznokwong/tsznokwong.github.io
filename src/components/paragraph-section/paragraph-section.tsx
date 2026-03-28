import React from "react";
import { Typography, useTheme } from "@mui/material";

import PageContainer from "../page-container";

type ParagraphSectionProps = {
  title?: string;
  subtitle?: string;
  background?: string;
  className?: string;
  secondaryText?: boolean;
  sx?: Record<string, any>;
};

const ParagraphSection = (props: ParagraphSectionProps) => {
  const { title, subtitle, background, className, secondaryText, sx } = props;
  const theme = useTheme();

  const rootSx = {
    padding: "28vh 0 12vh",
    display: "flex",
    flexDirection: "column" as const,
    textAlign: "left" as const,
    ...sx,
  };

  const titleSx = { color: theme.palette.primary.main };
  const titleSecondarySx = { color: theme.palette.secondary.main };
  const subtitleSx = {
    padding: "2rem 0",
    whiteSpace: "pre-line" as const,
  };
  const subtitleSecondarySx = {
    padding: "2rem 0",
    whiteSpace: "pre-line" as const,
    color: theme.palette.secondary.main,
  };

  return (
    <PageContainer
      sx={rootSx}
      className={className}
      background={background}
    >
      {title && (
        <Typography sx={secondaryText ? titleSecondarySx : titleSx} variant="h1">
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          sx={secondaryText ? subtitleSecondarySx : subtitleSx}
          variant="body1"
          color="textPrimary"
        >
          {subtitle}
        </Typography>
      )}
    </PageContainer>
  );
};

export default ParagraphSection;
