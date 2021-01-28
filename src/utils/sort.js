import {compare} from "./point-utils";

export const sortByStartTimeDesc = (points) => points.sort(
    (sort1, sort2) => compare(sort2.startTime, sort1.startTime)
);

export const sortByStartTimeAsc = (points) => points.sort(
    (sort1, sort2) => compare(sort1.startTime, sort2.startTime)
);

export const sortByDuration = (points) => points.sort(
    (sort1, sort2) => compare(sort2.duration, sort1.duration)
);

export const sortByPrice = (points) => points.sort(
    (sort1, sort2) => compare(sort2.price, sort1.price)
);
