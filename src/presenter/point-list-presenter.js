import PointsList from "../view/points-list";
import NoPoints from "../view/no-points";
import {render, RenderPosition, replaceChild} from "../utils/render";
import PointPresenter from "./point-presenter";
import {compare, updateItem} from "../utils/utils";
import Sort from "../view/sort";
import {SortType} from "../const";
import dayjs from "dayjs";

export default class PointListPresenter {

  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;
    this._pointPresenters = {};
    this._pointListComponent = new PointsList();
    this._noPointsComponent = new NoPoints();
    this._currentSortType = SortType.DEFAULT;
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSort = this._handleSort.bind(this);
  }

  _handleSort(sortType) {
    if (this._currentSortType === SortType.DEFAULT && sortType === SortType.DAY) {
      this._sortPoints(SortType.DAY);
    } else if (this._currentSortType === SortType.DAY && sortType === SortType.DAY) {
      this._sortPoints(SortType.DEFAULT);
    } else if (this._currentSortType !== sortType) {
      this._sortPoints(sortType);
    } else {
      return;
    }
    this._clearPointsList();
    this._renderPointsList();
    this._renderSort();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  init(points) {
    this._points = points.slice();
    this._sortPoints(this._currentSortType);
    this._renderSort();
    this._renderPointsList(points);
  }

  _renderSort() {
    if (this._points && this._points.length) {
      if (!this._sortComponent) {
        this._sortComponent = new Sort(this._currentSortType);
        render(this._pointListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
      } else {
        const oldSort = this._sortComponent;
        this._sortComponent = new Sort(this._currentSortType);
        replaceChild(oldSort, this._sortComponent);
      }
      this._sortComponent.setSortTypeChangeHandler(this._handleSort);
    }
  }

  _renderNoPoints() {
    render(this._pointListContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPointsList() {
    if (this._points && this._points.length) {
      render(this._pointListContainer, this._pointListComponent, RenderPosition.BEFOREEND);
      this._points.forEach((point) => this._renderPoint(point));
      return;
    }
    this._renderNoPoints();
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this._points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));
        break;
      case SortType.DAY:
        this._points.sort((sort1, sort2) => compare(sort2.startTime, sort1.startTime));
        break;
      case SortType.PRICE:
        this._points.sort((sort1, sort2) => compare(sort2.price, sort1.price));
        break;
      case SortType.TIME:
        this._points.sort((sort1, sort2) => compare(
            dayjs(sort1.startTime).diff(sort1.endTime, `second`),
            dayjs(sort2.startTime).diff(sort2.endTime, `second`))
        );
        break;
    }
    this._currentSortType = sortType;
  }

}
