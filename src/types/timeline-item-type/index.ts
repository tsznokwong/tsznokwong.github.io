const ConstTimelineItemTypes = [
  "Education",
  "Work",
  "Achievements",
  "Projects",
  "Activities",
  "Milestones",
] as const;

type TimelineItemType = typeof ConstTimelineItemTypes[number];

export default TimelineItemType;

export const TimelineItemTypes = ConstTimelineItemTypes.map((value) => value);
