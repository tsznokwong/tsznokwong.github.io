import React, { useState, useRef, useEffect } from "react";
import { Theme, Typography, Chip, Card, CardContent, CardActions, IconButton, Slide } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {
  TimelineItem as MUITimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent as MUITimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import InfoIcon from "@mui/icons-material/Info";

import TimelineItemIcon from "./timeline-item-icon";
import TimelineItemType from "../../../types/timeline-item-type";

type TimelineItemNormalProps = {
  category: "normal";
  title?: string;
  subtitle?: string;
  details?: string;
  timestamp?: string;
  type?: TimelineItemType;
  infolink?: string;
  highlights?: { title?: string; subtitle?: string }[];
};

type TimelineItemYearStampProps = {
  category: "year-stamp";
  year: string;
};

export type TimelineItemProps =
  | TimelineItemNormalProps
  | TimelineItemYearStampProps;

const TimelineItem = (props: TimelineItemProps) => {
  const classes = useStyles();
  const [isVisible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set visibility based on whether element is intersecting
        // This allows slide animation both on scroll down and scroll up
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <MUITimelineItem ref={ref}>
      <TimelineOppositeContent className={classes.oppositeContent} />
      <TimelineSeparator>
        <TimelineDotContent {...props} />
        <TimelineConnector className={classes.connector} />
      </TimelineSeparator>
      <Slide in={isVisible} direction="left" timeout={800} appear>
        <MUITimelineContent className={classes.timelineContent}>
          <TimelineContent {...props} />
        </MUITimelineContent>
      </Slide>
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
  yearstamp: {
    color: theme.palette.primary.main,
    width: "36px",
    display: "flex",
    justifyContent: "center",
  },
  yearstampContent: {
    marginBottom: "6rem",
  },
  timelineContent: {
    paddingRight: 0,
  },
  highlightRow: {
    display: "flex",
    flexDirection: "row",
  },
  highlightTitle: {
    marginRight: "1rem",
    fontWeight: "bold",
  },
  highlightSubtitle: {
    fontStyle: "italic",
  },
}));

const TimelineDotContent = (props: TimelineItemProps) => {
  const classes = useStyles();
  switch (props.category) {
    case "normal":
      return (
        <TimelineDot color="primary">
          <TimelineItemIcon type={props.type} defaultColor="primary" />
        </TimelineDot>
      );
    case "year-stamp":
      return (
        <Typography className={classes.yearstamp} variant="h2">
          {props.year}
        </Typography>
      );
    default:
      return (
        <TimelineDot color="primary">
          <TimelineItemIcon defaultColor="primary" />
        </TimelineDot>
      );
  }
};

const TimelineContent = (props: TimelineItemProps) => {
  const classes = useStyles();
  switch (props.category) {
    case "normal":
      const {
        title,
        subtitle,
        type,
        timestamp,
        details,
        infolink,
        highlights,
      } = props;
      return (
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
            {highlights &&
              highlights.map(({ title, subtitle }, index) => (
                <div
                  key={`highlight_${index}`}
                  className={classes.highlightRow}
                >
                  {title && (
                    <Typography
                      className={classes.highlightTitle}
                      variant="body2"
                      color="primary"
                    >
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Typography
                      className={classes.highlightSubtitle}
                      variant="body2"
                      color="textPrimary"
                    >
                      {subtitle}
                    </Typography>
                  )}
                </div>
              ))}
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
      );
    default:
      return <div className={classes.yearstampContent} />;
  }
};
