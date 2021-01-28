import RouteInfo from "../view/route-info";
import {render, RenderPosition, replaceChild} from "../utils/render";

export default class RouteInfoPresenter {
  constructor(tripMainElement, pointsModel) {
    this._tripMainElement = tripMainElement;
    this._pointsModel = pointsModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._routeInfoComponent = new RouteInfo(this._pointsModel.getPoints());
    render(this._tripMainElement, this._routeInfoComponent, RenderPosition.AFTERBEGIN);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    const newRouteInfoComponent = new RouteInfo(this._pointsModel.getPoints());
    replaceChild(this._routeInfoComponent, newRouteInfoComponent);
    this._routeInfoComponent = newRouteInfoComponent;
  }
}
