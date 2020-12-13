import {createElement, getTripCost} from "../utils";

export const createTripCostTemplate = (points) => {
  const cost = getTripCost(points);
  return cost ? `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
            </p>` : `<p/>`;
};


export default class TripCost {
  constructor(points) {
    this._element = null;
    this._points = points;
  }


  getTemplate() {
    return createTripCostTemplate(this._points);
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
