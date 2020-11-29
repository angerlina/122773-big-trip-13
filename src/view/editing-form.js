import {createElement, formatToDateTimeYear} from "../utils";
import {ALL_OFFERS, POINT_TYPES, TOWNS} from "../mock/data";

const getTownsOptionsList = () => {
  const result = `<datalist id="destination-list-1">
  ${TOWNS.map((townName) => `<option value="${townName}"></option>`).join(` `)}
  </datalist>`;
  return result;
};

const getEventTypeListTemplate = () => {
  return `<div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${POINT_TYPES.map((eventType) => (`<div class="event__type-item">
                          <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}">
                          <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-taxi-1">${eventType}</label>
                        </div>`)).join(``)}
                      </fieldset>
                    </div>`;
};

const getOffersTemplate = (point) => {
  const {offers, type} = point;
  const offersList = ALL_OFFERS.filter((offer) => offer.type === type).map((offer) => {
    const checked = offers && offers.some((item) => item.name === offer.name) ? `checked` : ``;
    const {name, cost} = offer;
    return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checked}>
                        <label class="event__offer-label" for="event-offer-${name}-1">
                          <span class="event__offer-title">${name}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${cost}</span>
                        </label>
                      </div>`;
  }).join(``);

  return offersList && offersList.length ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                        ${offersList}
                    </div>
                                </section>` : ``;
};

const createEditingPointFormTemplate = (point) => {
  const {type, destination: {town, description}, startTime, endTime, price} = point;
  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    ${getEventTypeListTemplate(POINT_TYPES)}
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town || ``}" list="destination-list-1">
                ${getTownsOptionsList(TOWNS)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatToDateTimeYear(startTime)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatToDateTimeYear(endTime)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price || ``}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">


            ${getOffersTemplate(point)}

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description || ``}</p>
                  </section>
                </section>
              </form>`;
};

export default class EditingForm {

  constructor(point = {type: `Flight`, destination: {}}) {
    this._point = point;
    this._element = null;
  }


  getTemplate() {
    return createEditingPointFormTemplate(this._point);
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
