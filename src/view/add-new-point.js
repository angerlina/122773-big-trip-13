import AbstractView from "./abstract-view";

export const createAddNewPointTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class AddNewPoint extends AbstractView {
  constructor() {
    super();
    this._addNewPointClickHandler = this._addNewPointClickHandler.bind(this);
  }

  _addNewPointClickHandler(evt) {
    evt.preventDefault();
    this._callback.handleAddNewPointClick(evt.target.dataset.name);
  }

  setAddNewPointClickHandler(callback) {
    this._callback.handleAddNewPointClick = callback;
    this.getElement().addEventListener(`click`, this._addNewPointClickHandler);
  }

  getTemplate() {
    return createAddNewPointTemplate();
  }

}
