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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflowX: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  },
}));
