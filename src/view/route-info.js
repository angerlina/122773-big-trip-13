import {createElement, formatToMonthDay} from "../utils";
import dayjs from "dayjs";

export const createRouteInfoTemplate = (points) => {
  const startDate = points && points.length && points[0].startTime;
  const startDateFormatted = formatToMonthDay(startDate);
  const endDate = points && points.length && points[points.length - 1].endTime;
  const endDateFormatted = dayjs(startDate).isSame(dayjs(endDate), `month`) ? dayjs(endDate).format(`DD`) : formatToMonthDay(endDate);
  return `<div class="trip-main">
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${points.map((point) => point.destination.town).join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${startDate && endDate ? [startDateFormatted, endDateFormatted].join(` &mdash; `) : ``}</p>
            </div>`;
};

export default class RouteInfo {
  constructor(points) {
    this._element = null;
    this._points = points;
  }


  getTemplate() {
    return createRouteInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

}
