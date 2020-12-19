import RouteInfo from "./view/route-info";
import TripCost from "./view/trip-cost";
import Menu from "./view/menu";
import Filters from "./view/filters";
import Sort from "./view/sort";
import EditingForm from "./view/editing-form";
import Point from "./view/point";
import {generatePoint} from "./mock/point";
import {compare} from "./utils";
import {POINT_COUNT} from "./mock/data";
import PointsList from "./view/points-list";
import NoPoints from "./view/no-points";
import {render, RenderPosition, replaceChild} from "./utils/render";

const points = Array(POINT_COUNT).fill().map(generatePoint);
points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));

const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const pageBodyContainer = document.querySelector(`body > main > div`);

const renderPoint = (pointsListElement, point) => {
  const editFormComponent = new EditingForm(point);
  const pointComponent = new Point(point);
  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);

  const replacePointToForm = () => {
    replaceChild(editFormComponent, pointComponent);
  };

  const replaceFormToCard = () => {
    replaceChild(pointComponent, editFormComponent);
  };


  const handleOpenForm = () => {
    replacePointToForm();
    editFormComponent.setCloseFormClickHandler(handleCloseForm);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const handleCloseForm = () => {
    replaceFormToCard();
    pointComponent.setClickOpenFormHandler(handleOpenForm);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };


  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      handleCloseForm();
    }
  };

  pointComponent.setClickOpenFormHandler(handleOpenForm);
  editFormComponent.setSubmitFormHandler(handleCloseForm);
};

const renderPoints = (pointsListElement, pointsForRendering) => {
  if (!pointsForRendering || !pointsForRendering.length) {
    render(pointsListElement, new NoPoints(), RenderPosition.AFTERBEGIN);
  }
  pointsForRendering.forEach((point) => renderPoint(pointsListElement, point));
};

const pointsListComponent = new PointsList();
render(pageBodyContainer, pointsListComponent, RenderPosition.AFTERBEGIN);
render(tripMainElement, new TripCost(points), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Menu(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Filters(), RenderPosition.BEFOREEND);
render(pointsListComponent, new Sort(points), RenderPosition.BEFOREEND);

renderPoints(pointsListComponent, points);


