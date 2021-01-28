import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, newPoint) {
    const index = this._points.findIndex((point) => point.id === newPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      newPoint,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, newPoint);
  }

  addPoint(updateType, newPoint) {
    this._points = [
      newPoint,
      ...this._points
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointToDelete) {
    const index = this._points.findIndex((point) => point.id === pointToDelete.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
