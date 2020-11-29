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

const points = Array(POINT_COUNT).fill(``).map(generatePoint);
points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));

const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsSectionElement = document.querySelector(`.trip-events`);
const rootPointElement = document.querySelector(`section.trip-events`);

const renderPoint = (point) => {
  const editFormComponent = new EditingForm(point);
  const pointComponent = new Point(point);
  render(tripEventsSectionElement, pointComponent.getElement(), RenderPosition.BEFOREEND);

  const closeButtonInForm = editFormComponent.getElement().querySelector(`.event__rollup-btn`);
  const openButtonInView = pointComponent.getElement().querySelector(`.event__rollup-btn`);

  const replacePointToForm = () => {
    rootPointElement.replaceChild(editFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    rootPointElement.replaceChild(pointComponent.getElement(), editFormComponent.getElement());
  };


  const handleOpenForm = () => {
    replacePointToForm();
    openButtonInView.removeEventListener(`click`, handleOpenForm);
    closeButtonInForm.addEventListener(`click`, handleCloseForm);
  };

  const handleCloseForm = () => {
    replaceFormToCard();
    openButtonInView.addEventListener(`click`, handleOpenForm);
    closeButtonInForm.removeEventListener(`click`, handleCloseForm);
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handleOpenForm);

  editFormComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    handleCloseForm();
  });
};

render(tripMainElement, new TripCost(getRandomInteger(0, MAX_TRIP_COST)).getElement(), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Menu().getElement(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Filters().getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsSectionElement, new Sort().getElement(), RenderPosition.BEFOREEND);

points.forEach((point) => renderPoint(point));


