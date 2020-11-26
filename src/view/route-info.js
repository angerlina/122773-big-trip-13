import {formatToMonthDay} from "../utils";
import dayjs from "dayjs";

export const createRouteInfoTemplate = (points) => {
  const startDate = points[0].startTime;
  const startDateFormatted = formatToMonthDay(startDate);
  const endDate = points[points.length - 1].endTime;
  const endDateFormatted = dayjs(startDate).isSame(dayjs(endDate), `month`) ? dayjs(endDate).format(`DD`) : formatToMonthDay(endDate);
  return points && points.length ? `<div class="trip-main">
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${points.map((point) => point.destination.town).join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${[startDateFormatted, endDateFormatted].join(` &mdash; `)}</p>
            </div>
` : ``;
};
