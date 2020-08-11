import React from "react";
import {
  makeStyles,
  Theme,
  Typography,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import {
  TimelineItem as MUITimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";
import InfoIcon from "@material-ui/icons/Info";

import TimelineItemIcon from "./timeline-item-icon";
import TimelineItemType from "../../../types/timeline-item-type";

export type TimelineItemProps = {
  title?: string;
  subtitle?: string;
  details?: string;
  timestamp?: string;
  type?: TimelineItemType;
  infolink?: string;
};

const TimelineItem = (props: TimelineItemProps) => {
  const classes = useStyles();
  const { title, subtitle, details, timestamp, type, infolink } = props;
  return (
    <MUITimelineItem>
      <TimelineOppositeContent className={classes.oppositeContent} />
      <TimelineSeparator>
        <TimelineDot color="primary">
          <TimelineItemIcon type={type} defaultColor="primary" />
        </TimelineDot>
        <TimelineConnector className={classes.connector} />
      </TimelineSeparator>
      <TimelineContent>
        <Card className={classes.content} elevation={3}>
          <CardContent>
            {type && (
              <Chip
                className={classes.chip}
                label={type}
                color="secondary"
                size="small"
              />
            )}
            {title && (
              <Typography className={classes.title} variant="h3">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography className={classes.subtitle} variant="h6">
                {subtitle}
              </Typography>
            )}
            {timestamp && (
              <Typography
                className={classes.timestamp}
                variant="body2"
                color="textSecondary"
              >
                {timestamp}
              </Typography>
            )}
            {details && (
              <Typography
                className={classes.details}
                variant="body2"
                color="textPrimary"
              >
                {details}
              </Typography>
            )}
          </CardContent>
          <CardActions className={classes.actions}>
            {infolink && (
              <a href={infolink} target="_blank" rel="noopener noreferrer">
                <IconButton size="small" aria-label="info">
                  <InfoIcon color="action" />
                </IconButton>
              </a>
            )}
          </CardActions>
        </Card>
      </TimelineContent>
    </MUITimelineItem>
  );
};

export default TimelineItem;

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  oppositeContent: {
    flex: 0,
    padding: "0",
  },
  connector: {
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "3rem",
    textAlign: "left",
  },
  title: { color: theme.palette.primary.dark },
  subtitle: { color: theme.palette.primary.light, fontStyle: "italic" },
  timestamp: { fontStyle: "italic" },
  details: {
    whiteSpace: "pre-line",
  },
  chip: {
    color: theme.palette.primary.main,
    marginBottom: "1rem",
  },
  actions: {
    width: "calc(100% - 16px)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
}));
