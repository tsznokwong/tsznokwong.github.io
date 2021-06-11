import React, { useState } from "react";
import {
  makeStyles,
  Theme,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Timeline as MUITimeline } from "@material-ui/lab";

import PageContainer from "../page-container";
import TimelineItem, { TimelineItemProps } from "./timeline-item";
import { TimelineItemTypes } from "../../types/timeline-item-type";
import TimelineItemIcon from "./timeline-item/timeline-item-icon";
import Tooltip from "../tooltip";

type TimelineProps = {
  items: TimelineItemProps[];
  className?: string;
};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  const { items, className } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const [filter, setFilter] = useState(TimelineItemTypes);
  return (
    <PageContainer className={`${classes.root} ${className}`}>
      <ButtonGroup
        size={isSmallScreen ? "small" : isLargeScreen ? "large" : "medium"}
      >
        {TimelineItemTypes.map((type, index) => (
          <Tooltip
            key={`filter_button_${index}`}
            title={type}
            aria-label={type}
          >
            <Button
              className={
                filter.includes(type)
                  ? classes.filterButtonSelected
                  : classes.filterButton
              }
              onClick={() => {
                if (filter.length === TimelineItemTypes.length) {
                  setFilter([type]);
                } else {
                  setFilter(
                    TimelineItemTypes.filter((filterType) => {
                      const isFiltered = filter.includes(filterType);
                      const clicked = type === filterType;
                      return !isFiltered === clicked;
                    })
                  );
                }
              }}
              disableRipple
            >
              <TimelineItemIcon type={type} color="primary" />
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
      <MUITimeline className={classes.timeline}>
        {items
          .filter((item) => {
            if (item.category === "year-stamp") {
              return true;
            }
            if (item.type && TimelineItemTypes.includes(item.type)) {
              return filter.includes(item.type);
            }
            return true;
          })
          .filter((item, index, items) => {
            if (item.category === "normal") {
              return true;
            }
            return (
              items[index - 1]?.category !== "year-stamp" ||
              items[index + 1]?.category !== "year-stamp"
            );
          })
          .map((item, index) => (
            <TimelineItem key={`timeline_item_${index}`} {...item} />
          ))}
      </MUITimeline>
    </PageContainer>
  );
};

export default Timeline;

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  oppositeContent: {
    flex: 0,
  },
  connector: {
    backgroundColor: theme.palette.primary.main,
  },
  filterButton: {
    borderColor: theme.palette.primary.main,
  },
  filterButtonSelected: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
    backgroundColor: theme.palette.secondary.light,
    borderColor: theme.palette.primary.main,
  },
  timeline: {
    padding: "6px 6px",
  },
}));
