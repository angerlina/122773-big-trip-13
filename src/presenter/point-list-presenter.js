import PointsList from "../view/points-list";
import NoPoints from "../view/no-points";
import {render, RenderPosition} from "../utils/render";
import PointPresenter from "./point-presenter";
import {updateItem} from "../utils/utils";

export default class PointListPresenter {

  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;
    this._pointPresenter = {};
    this._pointListComponent = new PointsList();
    this._noPointsComponent = new NoPoints();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  _handlePointChange(updatedPoint) {
    debugger;
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  init(points) {
    this._points = points.slice();
    this.initialPoints = points.slice();
    render(this._pointListContainer, this._pointListComponent, RenderPosition.AFTERBEGIN);
    this._renderPointsList(points);
  }

  _renderNoPoints() {
    render(this._pointListComponent, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointsList() {
    if (this._points && this._points.length) {
      this._points.forEach((point) => this._renderPoint(point));
      return;
    }
    this._renderNoPoints();
  }


}
