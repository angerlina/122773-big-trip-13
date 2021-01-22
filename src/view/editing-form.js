import {formatToDateTimeYear} from "../utils/utils";
import {POINT_TYPES, TOWNS} from "../mock/data";
import SmartView from "./smart-view";
import {getDestinationInfo, getOffersForType} from "../mock/point";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import dayjs from "dayjs";
import {getDatePicker} from "../utils/datepicker";

const getPhotosTemplate = (photos) => {
  return `<div class="event__photos-container">
                      <div class="event__photos-tape">
${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`)}
</div></div>`;
};
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
                          <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
                        </div>`)).join(``)}
                      </fieldset>
                    </div>`;
};

const getOffersTemplate = (data) => {
  const {offers, offersForType} = data;
  const offersList = offersForType.map((offer) => {
    const checked = offers && offers.some((item) => item.name === offer.name) ? `checked` : ``;
    const {name, cost} = offer;
    return `<div class="event__offer-selector">
                        <input data-offer-name="${name}" class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checked}>
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

const getDescriptionTemplate = (description) => {
  return ` <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description || ``}</p>`;
};

const createEditingPointFormTemplate = (data) => {
  const {type, destination: {town, description, photos}, startTime, endTime, price} = data;
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
            ${getOffersTemplate(data)}
                  <section class="event__section  event__section--destination">
                    ${description ? getDescriptionTemplate(description) : ``}
                    ${photos && photos.length ? getPhotosTemplate(data.destination.photos) : ``}
                  </section>
                </section>
              </form>`;
};

export default class EditingForm extends SmartView {

  constructor(point = {type: `Flight`, destination: {}}) {
    super();
    this._data = EditingForm.parsePointToData(point);
    this._startTimeDatepicker = null;
    this._endTimeDatepicker = null;
    this._closeFormClickHandler = this._closeFormClickHandler.bind(this);
    this._submitFormHandler = this._submitFormHandler.bind(this);
    this._changeEventTypeHandler = this._changeEventTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._inputPriceHandler = this._inputPriceHandler.bind(this);
    this._changeOffersHandler = this._changeOffersHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitFormHandler);
    this.setCloseFormClickHandler(this._callback.closeFormClickHandler);
    this._setDatepicker();
  }


  _setDatepicker() {
    if (this._startTimeDatepicker) {
      this._startTimeDatepicker.destroy();
      this._startTimeDatepicker = null;
    }

    this._startTimeDatepicker = getDatePicker(
        this.getElement().querySelector(`[name='event-start-time']`),
        this._data.startTime,
        this._startTimeChangeHandler);

    if (this._endTimeDatepicker) {
      this._endTimeDatepicker.destroy();
      this._endTimeDatepicker = null;
    }

    this._endTimeDatepicker = getDatePicker(
        this.getElement().querySelector(`[name='event-end-time']`),
        this._data.endTime,
        this._endTimeChangeHandler);
  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      startTime: dayjs(userDate),
    });
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      endTime: dayjs(userDate),
    });
  }


  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._changeEventTypeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._changeDestinationHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._inputPriceHandler);
    if (this._data.offersForType && this._data.offersForType.length) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._changeOffersHandler);
    }
  }

  _changeOffersHandler(evt) {
    evt.preventDefault();
    const {dataset: {offerName}, checked} = evt.target;
    let updatedOffers = this._data.offers.slice();
    if (checked) {
      updatedOffers.push(this._data.offersForType.find(
          (offer) => offer.name.toLowerCase() === offerName.toLowerCase())
      );
    } else {
      updatedOffers = updatedOffers.filter((offer) => offer.name.toLowerCase() !== offerName.toLowerCase());
    }
    this.updateData({
      offers: updatedOffers,
    });
  }

  _changeEventTypeHandler(evt) {
    const {value: type} = evt.target;
    this.updateData({
      type,
      offers: [],
      offersForType: getOffersForType(type)
    });
  }

  _changeDestinationHandler(evt) {
    const {value: destination} = evt.target;
    if (destination) {
      this.updateData(
          {destination: getDestinationInfo(destination)}
      );
    } else {
      this.updateData({destination: {}});
    }
  }

  _inputPriceHandler(evt) {
    this.updateData({price: evt.target.value}, true);
  }

  _closeFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormClickHandler();
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._closeFormClickHandler);
  }

  setCloseFormClickHandler(callback) {
    this._callback.closeFormClickHandler = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormClickHandler);
  }

  _submitFormHandler(evt) {
    evt.preventDefault();
    this._callback.submitFormHandler(this._data);
  }

  setSubmitFormHandler(callback) {
    this._callback.submitFormHandler = callback;
    this.getElement().addEventListener(`submit`, this._submitFormHandler);
  }

  getTemplate() {
    return createEditingPointFormTemplate(this._data);
  }

  reset(point) {
    this.updateData(
        EditingForm.parseDataToPoint(point)
    );
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          offersForType: getOffersForType(point.type)}
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.offersForType;
    return data;
  }

}
