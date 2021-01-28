import {createElement} from "../utils/render";

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
