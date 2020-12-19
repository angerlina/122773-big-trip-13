import {createElement} from "../utils";

export default class AbstractView {

  constructor() {
    if (new.target === AbstractView) {
      throw Error(`Абстрактный класс не должен создавать экземпляр!`);
    }
    this._element = null;
    this._callback = {};
  }
  getTemplate() {
    throw new Error(`Абстрактный метод не имплементирован!`);
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
