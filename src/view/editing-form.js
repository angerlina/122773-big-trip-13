import {
  formatToDateTimeYear,
  getDestinationInfo,
  getDestinationNames,
  getDuration,
  getOffersForTypeForClient
} from "../utils/point-utils";
import SmartView from "./smart-view";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import dayjs from "dayjs";
import {getDatePicker} from "../utils/datepicker";
import {createElement, replaceChild} from "../utils/render";
import {POINT_TYPES} from "../const";

const getPhotosTemplate = (photos) => {
  return `<div class="event__photos-container">
                      <div class="event__photos-tape">
${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`)}
</div></div>`;
};
const getTownsOptionsList = (destinationNames) => {
  const result = `<datalist id="destination-list-1">
  ${destinationNames.map((townName) => `<option value="${townName}"></option>`).join(` `)}
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
  const {offers, offersForType, isDisabled} = data;
  const offersList = offersForType.map((offer) => {
    const checked = offers && offers.some((item) => item.name === offer.name) ? `checked` : ``;
    const {name, cost} = offer;
    return `<div class="event__offer-selector">
                        <input ${isDisabled ? `disabled` : ``} data-offer-name="${name}" class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${checked}>
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

const getSaveButtonTemplate = (data) => {
  const {destination: {town}, startTime, endTime, price, isDisabled, isSaving} = data;
  const isSubmitDisabled = (!price || !town || !startTime || !endTime || startTime > endTime);
  return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? `disabled` : ``}>${isSaving ? `saving...` : `save`}</button>`;
};

const createEditingPointFormTemplate = (data) => {
  const {type, destination: {town, description, photos}, startTime, endTime, price, isDisabled, isDeleting} = data;
  const destinationNames = getDestinationNames();
  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>
                    ${getEventTypeListTemplate(POINT_TYPES)}
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input ${isDisabled ? `disabled` : ``} required pattern="${destinationNames.join(`|`)}" title="Можно выбрать город только из списка!" class="event__input  event__input--destination" id="event-destination-1" name="event-destination" value="${town || ``}" list="destination-list-1">
                ${getTownsOptionsList(destinationNames)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input ${isDisabled ? `disabled` : ``} class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatToDateTimeYear(startTime)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input ${isDisabled ? `disabled` : ``} class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatToDateTimeYear(endTime)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input min="0" step="1" autocomplete="off" ${isDisabled ? `disabled` : ``} class="event__input  event__input--price" id="event-price-1" required type="number" name="event-price" value="${price || ``}">
                  </div>
                  ${getSaveButtonTemplate(data)}
                  <button class="event__reset-btn" type="reset">${isDeleting ? `deleting...` : `delete`}</button>
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

  constructor(point = {type: `Flight`, destination: {}, offers: []}) {
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
    this._deletePointClickHandler = this._deletePointClickHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitFormHandler(this._callback.submitFormHandler);
    this.setCloseFormClickHandler(this._callback.closeFormClickHandler);
    this.setDeletePointClickHandler(this._callback.deletePointClickHandler);
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
      startTime: dayjs(userDate).toDate(),
      duration: getDuration(this._data.startTime, this._data.endTime)
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


  _rerenderSaveButton() {
    replaceChild(this.getElement().querySelector(`.event__save-btn`), createElement(getSaveButtonTemplate(this._data)));
  }

  setCloseFormClickHandler(callback) {
    this._callback.closeFormClickHandler = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormClickHandler);
  }


  setSubmitFormHandler(callback) {
    this._callback.submitFormHandler = callback;
    this.getElement().addEventListener(`submit`, this._submitFormHandler);
  }

  setDeletePointClickHandler(callback) {
    this._callback.deletePointClickHandler = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deletePointClickHandler);
  }

  getTemplate() {
    return createEditingPointFormTemplate(this._data);
  }

  reset(point) {
    this.updateData(
        EditingForm.parseDataToPoint(point)
    );
  }

  _submitFormHandler(evt) {
    evt.preventDefault();
    this._callback.submitFormHandler(EditingForm.parseDataToPoint(this._data));
  }

  _deletePointClickHandler(evt) {
    evt.preventDefault();
    this._callback.deletePointClickHandler(this._data);
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      endTime: dayjs(userDate).toDate(),
      duration: getDuration(this._data.startTime, this._data.endTime)
    });
  }

  _inputPriceHandler(evt) {
    evt.preventDefault();
    this.updateData({price: evt.target.value}, true);
    this._rerenderSaveButton();
  }

  _closeFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormClickHandler();
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._closeFormClickHandler);
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

  _changeEventTypeHandler(evt) {
    const {value: type} = evt.target;
    this.updateData({
      type: type.toLowerCase(),
      offers: [],
      offersForType: getOffersForTypeForClient(type)
    });
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

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
          offersForType: getOffersForTypeForClient(point.type)}
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data, {type: data.type.toLowerCase()});
    delete data.offersForType;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }

}
