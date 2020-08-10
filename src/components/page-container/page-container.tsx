import React, { ReactNode } from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";

type PageContainerProps = {
  background?: string;
  children?: ReactNode;
  className?: string;
};

const PageContainer = (props: PageContainerProps) => {
  const classes = useStyles();
  const { background, children, className } = props;
  return (
    <Container
      className={`${classes.root} ${className}`}
      style={{
        backgroundImage: background ? `url(${background})` : undefined,
      }}
      maxWidth={false}
      disableGutters
    >
      <Container maxWidth="md">{children}</Container>
    </Container>
  );
};

export default PageContainer;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  },
}));
