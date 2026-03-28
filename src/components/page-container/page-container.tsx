import React, { ReactNode } from "react";
import { Container } from "@mui/material";

type PageContainerProps = {
  background?: string;
  children?: ReactNode;
  className?: string;
  sx?: Record<string, any>;
};

const PageContainer = (props: PageContainerProps) => {
  const { background, children, className, sx } = props;

  const rootSx = {
    overflowX: "hidden" as const,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    ...sx,
  };

  return (
    <Container
      sx={rootSx}
      className={className}
      maxWidth={false}
      disableGutters
      style={{
        backgroundImage: background ? `url(${background})` : undefined,
      }}
    >
      <Container maxWidth="md">{children ?? <div />}</Container>
    </Container>
  );
};

export default PageContainer;
