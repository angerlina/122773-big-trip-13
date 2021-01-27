import {render, RenderPosition, replaceChild} from "../utils/render";
import TripCost from "../view/trip-cost";

export default class TripCostPresenter {
  constructor(tripMainElement, pointsModel) {
    this._tripMainElement = tripMainElement;
    this._pointsModel = pointsModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._tripCostComponent = new TripCost(this._pointsModel.getPoints());
    render(this._tripMainElement, this._tripCostComponent, RenderPosition.AFTERBEGIN);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    const newTripCostComponent = new TripCost(this._pointsModel.getPoints());
    replaceChild(this._tripCostComponent, newTripCostComponent);
    this._tripCostComponent = newTripCostComponent;
  }
}
