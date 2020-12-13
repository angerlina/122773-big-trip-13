import RouteInfo from "./view/route-info";
import TripCost from "./view/trip-cost";
import Menu from "./view/menu";
import Filters from "./view/filters";
import Sort from "./view/sort";
import EditingForm from "./view/editing-form";
import Point from "./view/point";
import {generatePoint} from "./mock/point";
import {compare, getRandomInteger, render, RenderPosition} from "./utils";
import {MAX_TRIP_COST, POINT_COUNT} from "./mock/data";
import PointsList from "./view/points-list";
import NoPoints from "./view/no-points";

const points = Array(POINT_COUNT).fill().map(generatePoint);
points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));

const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const pageBodyContainer = document.querySelector(`body > main > div`);

const renderPoint = (pointsListElement, point) => {
  const editFormComponent = new EditingForm(point);
  const pointComponent = new Point(point);
  render(pointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);

  const closeButtonInForm = editFormComponent.getElement().querySelector(`.event__rollup-btn`);
  const openButtonInView = pointComponent.getElement().querySelector(`.event__rollup-btn`);

  const replacePointToForm = () => {
    pointsListElement.replaceChild(editFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), editFormComponent.getElement());
  };


  const handleOpenForm = () => {
    replacePointToForm();
    openButtonInView.removeEventListener(`click`, handleOpenForm);
    closeButtonInForm.addEventListener(`click`, handleCloseForm);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const handleCloseForm = () => {
    replaceFormToCard();
    openButtonInView.addEventListener(`click`, handleOpenForm);
    closeButtonInForm.removeEventListener(`click`, handleCloseForm);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };


  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      handleCloseForm();
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handleOpenForm);


  editFormComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    handleCloseForm();
  });
};

const renderPoints = (pointsListElement, pointsForRendering) => {
  if (!pointsForRendering || !pointsForRendering.length) {
    render(pointsListElement, new NoPoints().getElement(), RenderPosition.AFTERBEGIN);
  }
  pointsForRendering.forEach((point) => renderPoint(pointsListElement, point));
};

const pointsListComponent = new PointsList();
render(pageBodyContainer, pointsListComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripMainElement, new TripCost(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Menu().getElement(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Filters().getElement(), RenderPosition.BEFOREEND);
render(pointsListComponent.getElement(), new Sort(points).getElement(), RenderPosition.BEFOREEND);

renderPoints(pointsListComponent.getElement(), points);


