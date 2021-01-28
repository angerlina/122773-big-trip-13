import {compare} from "./utils";

export const sortByStartTime = (points) => points.sort(
    (sort1, sort2) => compare(sort2.startTime, sort1.startTime)
);

export const sortByDuration = (points) => points.sort(
    (sort1, sort2) => compare(sort1.duration, sort2.duration)
);

export const sortByPrice = (points) => points.sort(
    (sort1, sort2) => compare(sort2.price, sort1.price)
);
