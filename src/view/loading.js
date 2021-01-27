import AbstractView from "./abstract-view";

export const createNoPointsTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class NoPoints extends AbstractView {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
