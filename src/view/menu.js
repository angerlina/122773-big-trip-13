import AbstractView from "./abstract-view";
import {MenuItem} from "../const";

export const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn" data-name="${MenuItem.TABLE}" href="#">Table</a>
              <a class="trip-tabs__btn" data-name="${MenuItem.STATS}" href="#">Stats</a>
            </nav>`;
};
export default class Menu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _menuClickHandler(evt) {
    this._callback.handleMenuClick(evt.target.dataset.name);
  }

  setMenuClickHandler(callback) {
    this._callback.handleMenuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuItem(menuItem) {
    const activeClassName = `trip-tabs__btn--active`;
    const allItems = this.getElement().querySelectorAll(`a`);
    allItems.forEach((item) => item.classList.remove(activeClassName));
    const item = this.getElement().querySelector(`[data-name=${menuItem}]`);
    if (item !== null) {
      item.classList.add(activeClassName);
    }
  }

}
