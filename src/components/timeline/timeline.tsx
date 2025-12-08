import React, { useState } from "react";
import { Theme, Button, ButtonGroup, useTheme, useMediaQuery } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Timeline as MUITimeline } from "@mui/lab";
import { Sticky, StickyContainer } from "react-sticky";

import PageContainer from "../page-container";
import TimelineItem, { TimelineItemProps } from "./timeline-item";
import { TimelineItemTypes } from "../../types/timeline-item-type";
import TimelineItemIcon from "./timeline-item/timeline-item-icon";
import Tooltip from "../tooltip";
import { usePageBarTrigger } from "../page-bar/page-bar-hooks";

type TimelineProps = {
  items: TimelineItemProps[];
  className?: string;
};

const Timeline = (props: TimelineProps) => {
  const classes = useStyles();
  const { items, className } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const [filter, setFilter] = useState(TimelineItemTypes);
  const trigger = usePageBarTrigger();
  return (
    <StickyContainer>
      <PageContainer className={`${classes.root} ${className}`}>
        <Sticky>
          {({ style }) => (
            <div className={classes.sticky}>
              <ButtonGroup
                className={classes.filterButtonGroup}
                size={
                  isSmallScreen ? "small" : isLargeScreen ? "large" : "medium"
                }
                style={{
                  ...style,
                  left: undefined,
                  width: undefined,
                  top: trigger ? "5rem" : "1rem",
                }}
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
            </div>
          )}
        </Sticky>
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
    </StickyContainer>
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
  sticky: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonGroup: {
    zIndex: 999,
  },
  filterButton: {
    borderColor: theme.palette.primary.main,
    backgroundColor: "rgba(1, 1, 1, 0.05)",
    backdropFilter: "blur(5px)",
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
