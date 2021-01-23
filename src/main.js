import RouteInfo from "./view/route-info";
import TripCost from "./view/trip-cost";
import Menu from "./view/menu";
import {generatePoint} from "./mock/point";
import {POINT_COUNT} from "./mock/data";
import {render, RenderPosition} from "./utils/render";
import PointListPresenter from "./presenter/point-list-presenter";
import Points from "./model/points";
import Filter from "./model/filter";
import FilterPresenter from "./presenter/filter-presenter";

const points = Array(POINT_COUNT).fill().map(generatePoint);
const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);

render(tripMainElement, new TripCost(points), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Menu(), RenderPosition.AFTERBEGIN);

const pointsModel = new Points();
pointsModel.setPoints(points);
const filtersModel = new Filter();
const pointListPresenter = new PointListPresenter(tripEventsContainer, pointsModel, filtersModel);
pointListPresenter.init();
const filterPresenter = new FilterPresenter(controlsMainElement, filtersModel, pointsModel);
filterPresenter.init();


document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  pointListPresenter.createPoint();
});
