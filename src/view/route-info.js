import {formatToMonthDay} from "../utils/point-utils";
import dayjs from "dayjs";
import AbstractView from "./abstract-view";
import {sortByStartTimeAsc} from "../utils/sort";

export const createRouteInfoTemplate = (points) => {
  if (points && points.length) {
    const pointsCopy = sortByStartTimeAsc(points.slice());
    const startDate = pointsCopy[0].startTime;
    const startDateFormatted = formatToMonthDay(startDate);
    const endDate = pointsCopy[pointsCopy.length - 1].endTime;
    const endDateFormatted = dayjs(startDate).isSame(dayjs(endDate), `month`) ? dayjs(endDate).format(`DD`) : formatToMonthDay(endDate);
    return `<div class="trip-main">
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${pointsCopy.map((point) => point.destination.town).join(` &mdash; `)}</h1>
              <p class="trip-info__dates">${`${startDateFormatted}  &mdash; ${endDateFormatted}`}</p>
            </div>`;
  }
  return `<div/>`;
};

export default class RouteInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._points);
  }
}
