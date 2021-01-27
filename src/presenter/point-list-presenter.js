import PointsList from "../view/points-list";
import NoPoints from "../view/no-points";
import {remove, render, RenderPosition} from "../utils/render";
import PointPresenter, {State as PointPresenterViewState} from "./point-presenter";
import Sort from "../view/sort";
import {FilterType, SortType, UpdateType, UserAction} from "../const";
import {sortByDuration, sortByPrice, sortByStartTime} from "../utils/sort";
import {filter} from "../utils/filter";
import PointNewPresenter from "./point-new-presenter";
import Loading from "../view/loading.js";

export default class PointListPresenter {

  constructor(tripEventsContainer, pointsModel, filterModel, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenters = {};
    this._pointListComponent = new PointsList();
    this._noPointsComponent = new NoPoints();
    this._loadingComponent = new Loading();
    this._currentSortType = SortType.START_TIME;
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSort = this._handleSort.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
    this._isLoading = true;
    this._api = api;
  }


  init() {
    this._renderPointsList();
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  show() {
    if (this._pointListComponent) {
      this._pointListComponent.show();
      this._sortComponent.show();
    }
  }

  hide() {
    if (this._pointListComponent) {
      this._pointListComponent.hide();
      this._sortComponent.hide();
    }
  }


  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          }).catch(() => {
            this._pointPresenters[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          }).catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        }).catch(() => {
          this._pointPresenters[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._clearPointsList({resetSortType: false});
        this._renderPointsList();
        break;
      case UpdateType.MAJOR:
        this._clearPointsList({resetSortType: true});
        this._renderPointsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const points = this._getPoints();
    if (points && points.length) {
      render(this._tripEventsContainer, this._pointListComponent, RenderPosition.BEFOREEND);
      this._renderSort();
      points.forEach((point) => this._renderPoint(point));
      return;
    }
    this._renderNoPoints();
  }

  _clearPointsList({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
    if (resetSortType) {
      this._currentSortType = SortType.START_TIME;
    }
    remove(this._noPointsComponent);
    remove(this._sortComponent);
    remove(this._loadingComponent);
  }

  destroy() {
    this._clearPointsList({resetSortType: true});

    remove(this._pointListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

}
