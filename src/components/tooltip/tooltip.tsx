import { Tooltip as MUITooltip, Theme } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

const Tooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
  },
}))(MUITooltip);

export default Tooltip;
