const ConstTimelineItemTypes = [
  "Education",
  "Work",
  "Team/Society",
  "Projects",
  "Achievements",
  "Milestones",
] as const;

type TimelineItemType = typeof ConstTimelineItemTypes[number];

export default TimelineItemType;

export const TimelineItemTypes = ConstTimelineItemTypes.map((value) => value);
