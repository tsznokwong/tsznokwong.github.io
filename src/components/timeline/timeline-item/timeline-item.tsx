import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Slide,
  useTheme,
  Box,
} from "@mui/material";
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
  const theme = useTheme();
  const [isVisible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const oppositeContentSx = {
    flex: 0,
    padding: "0",
  };

  const connectorSx = {
    backgroundColor: theme.palette.primary.main,
  };

  const timelineContentSx = {
    paddingRight: 0,
  };

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
      <TimelineOppositeContent sx={oppositeContentSx} />
      <TimelineSeparator>
        <TimelineDotContent {...props} />
        <TimelineConnector sx={connectorSx} />
      </TimelineSeparator>
      <Slide in={isVisible} direction="left" timeout={800} appear>
        <MUITimelineContent sx={timelineContentSx}>
          <TimelineContent {...props} />
        </MUITimelineContent>
      </Slide>
    </MUITimelineItem>
  );
};

export default TimelineItem;

const TimelineDotContent = (props: TimelineItemProps) => {
  const theme = useTheme();

  const yearstampSx = {
    color: theme.palette.primary.main,
    width: "36px",
    display: "flex",
    justifyContent: "center",
  };

  switch (props.category) {
    case "normal":
      return (
        <TimelineDot color="primary">
          <TimelineItemIcon type={props.type} defaultColor="primary" />
        </TimelineDot>
      );
    case "year-stamp":
      return (
        <Typography sx={yearstampSx} variant="h2">
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
  const theme = useTheme();

  const contentSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "3rem",
    textAlign: "left",
  };

  const titleSx = { color: theme.palette.primary.dark };
  const subtitleSx = { color: theme.palette.primary.light, fontStyle: "italic" };
  const timestampSx = { fontStyle: "italic" };
  const detailsSx = {
    whiteSpace: "pre-line",
  };
  const chipSx = {
    color: theme.palette.primary.main,
    marginBottom: "1rem",
  };
  const actionsSx = {
    width: "calc(100% - 16px)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  };
  const yearstampContentSx = {
    marginBottom: "6rem",
  };
  const highlightRowSx = {
    display: "flex",
    flexDirection: "row",
  };
  const highlightTitleSx = {
    marginRight: "1rem",
    fontWeight: "bold",
  };
  const highlightSubtitleSx = {
    fontStyle: "italic",
  };

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
        <Card sx={contentSx} elevation={3}>
          <CardContent>
            {type && (
              <Chip
                sx={chipSx}
                label={type}
                color="secondary"
                size="small"
              />
            )}
            {title && (
              <Typography sx={titleSx} variant="h3">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography sx={subtitleSx} variant="h6">
                {subtitle}
              </Typography>
            )}
            {timestamp && (
              <Typography
                sx={timestampSx}
                variant="body2"
                color="textSecondary"
              >
                {timestamp}
              </Typography>
            )}
            {highlights &&
              highlights.map(({ title, subtitle }, index) => (
                <Box
                  key={`highlight_${index}`}
                  sx={highlightRowSx}
                >
                  {title && (
                    <Typography
                      sx={highlightTitleSx}
                      variant="body2"
                      color="primary"
                    >
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Typography
                      sx={highlightSubtitleSx}
                      variant="body2"
                      color="textPrimary"
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              ))}
            {details && (
              <Typography
                sx={detailsSx}
                variant="body2"
                color="textPrimary"
              >
                {details}
              </Typography>
            )}
          </CardContent>
          <CardActions sx={actionsSx}>
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
      return <Box sx={yearstampContentSx} />;
  }
};
