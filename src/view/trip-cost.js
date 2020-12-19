import {getTripCost} from "../utils";
import AbstractView from "./AbstractView";

export const createTripCostTemplate = (points) => {
  const cost = getTripCost(points);
  return cost ? `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
            </p>` : `<p/>`;
};


export default class TripCost extends AbstractView {
  constructor(points) {
    super();
    this._element = null;
    this._points = points;
  }


  getTemplate() {
    return createTripCostTemplate(this._points);
  }

}
