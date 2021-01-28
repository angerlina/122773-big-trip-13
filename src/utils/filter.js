import {FilterType} from "../const";
import dayjs from "dayjs";
export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs((point.startTime)))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs((point.startTime)))),
};
