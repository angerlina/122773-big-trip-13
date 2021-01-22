import PointsList from "../view/points-list";
import NoPoints from "../view/no-points";
import {remove, render, RenderPosition} from "../utils/render";
import PointPresenter from "./point-presenter";
import Sort from "../view/sort";
import {SortType, UpdateType, UserAction} from "../const";
import {sortByDuration, sortByPrice, sortByStartTime} from "../utils/sort";
import {filter} from "../utils/filter";

export default class PointListPresenter {

  constructor(tripEventsContainer, pointsModel, filterModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenters = {};
    this._pointListComponent = new PointsList();
    this._noPointsComponent = new NoPoints();
    this._currentSortType = SortType.START_TIME;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSort = this._handleSort.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }


  init() {
    this._renderPointsList();
  }


  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        this._clearPointsList();
        this._renderPointsList();
        break;
    }
  }

  _getPoints() {
    const points = this._pointsModel.getPoints();
    const filterType = this._filterModel.getFilter();
    const filteredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.START_TIME: sortByStartTime(filteredPoints);
        break;
      case SortType.PRICE: sortByPrice(filteredPoints);
        break;
      case SortType.DURATION: sortByDuration(filteredPoints);
        break;
    }
    return filteredPoints;
  }

  _handleSort(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPointsList();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeClickHandler(this._handleSort);

    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPointsList() {
    const points = this._getPoints();
    if (points && points.length) {
      render(this._tripEventsContainer, this._pointListComponent, RenderPosition.BEFOREEND);
      this._renderSort();
      points.forEach((point) => this._renderPoint(point));
      return;
    }
    this._renderNoPoints();
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
    remove(this._noPointsComponent);
    remove(this._sortComponent);
  }


}
