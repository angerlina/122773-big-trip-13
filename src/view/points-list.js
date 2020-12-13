import {createElement} from "../utils";

export const createPointsListTemplate = () => {
  return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
          </section>`;
};

export default class PointsList {
  constructor() {
    this._element = null;
  }


  getTemplate() {
    return createPointsListTemplate();
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
