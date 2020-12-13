import {getDuration, formatToMonthDay, getStartEndDateTime, createElement} from "../utils";

const getOfferTemplate = (offer) => {
  return `<li class="event__offer">
                    <span class="event__offer-title">${offer.name}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.cost}</span>
                  </li>`;
};
const getOffersTemplate = (offers) => {
  return offers && offers.length ? `<ul class="event__selected-offers">
                 ${offers.map(getOfferTemplate).join(`\n`)}
                </ul>` : ``;
};
export const createPointTemplate = (point) => {
  const favoriteButtonClass = point.isFavorite ? `event__favorite-btn--active` : ``;
  const duration = getDuration(point.startTime, point.endTime);
  const monthDay = formatToMonthDay(point.startTime);
  const startEndDateTimes = getStartEndDateTime(point.startTime, point.endTime).split(`-`);
  return `<div class="event">
                <time class="event__date" datetime="2020-01-19">${monthDay}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${point.type} ${point.destination.town}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${startEndDateTimes[0]}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T11:00">${startEndDateTimes[1]}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
               ${getOffersTemplate(point.offers)}
                <button class="event__favorite-btn ${favoriteButtonClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>`;
};

export default class Point {
  constructor(point) {
    this._task = point;
    this._element = null;
  }


  getTemplate() {
    return createPointTemplate(this._task);
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