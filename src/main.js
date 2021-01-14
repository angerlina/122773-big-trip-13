import RouteInfo from "./view/route-info";
import TripCost from "./view/trip-cost";
import Menu from "./view/menu";
import Filters from "./view/filters";
import Sort from "./view/sort";
import {generatePoint} from "./mock/point";
import {compare} from "./utils/utils";
import {POINT_COUNT} from "./mock/data";
import {render, RenderPosition} from "./utils/render";
import PointListPresenter from "./presenter/point-list-presenter";

const points = Array(POINT_COUNT).fill().map(generatePoint);
points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));

const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const pageBodyContainer = document.querySelector(`.trip-events`);

render(tripMainElement, new TripCost(points), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Menu(), RenderPosition.AFTERBEGIN);
render(controlsMainElement, new Filters(), RenderPosition.BEFOREEND);

const pointListPresenter = new PointListPresenter(pageBodyContainer);
pointListPresenter.init(points);
