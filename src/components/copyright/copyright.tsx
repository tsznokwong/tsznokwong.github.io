import React from "react";
import { Typography } from "@material-ui/core";

type CopyrightProps = {};

const Copyright = (props: CopyrightProps) => {
  return (
    <Typography variant="body2" color="textSecondary">
      {`WONG Tsz Nok, Joshua © ${new Date().getFullYear()}.`}
    </Typography>
  );
};

export default Copyright;
