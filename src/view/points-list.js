import AbstractView from "./AbstractView";

export const createPointsListTemplate = () => {
  return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
          </section>`;
};

export default class PointsList extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}
