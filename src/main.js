import {createRouteInfoTemplate} from "./view/route-info";
import {createTripCostTemplate} from "./view/trip-cost";
import {createMenuTemplate} from "./view/menu";
import {createFiltersTemplate} from "./view/filters";
import {createSortTemplate} from "./view/sort";
import {createEditingPointFormTemplate} from "./view/editing-form";
import {createPointTemplate} from "./view/point";
import {generatePoint} from "./mock/point";
import {compare, getRandomInteger} from "./utils";
import {MAX_TRIP_COST, POINT_COUNT} from "./mock/data";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const points = Array(POINT_COUNT).fill(``).map(generatePoint);
points.sort((sort1, sort2) => compare(sort1.startTime, sort2.startTime));

const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsSectionElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripCostTemplate(getRandomInteger(0, MAX_TRIP_COST)), `afterbegin`);
render(tripMainElement, createRouteInfoTemplate(points), `afterbegin`);
render(controlsMainElement, createMenuTemplate(), `afterbegin`);
render(controlsMainElement, createFiltersTemplate(), `beforeend`);
render(tripEventsSectionElement, createSortTemplate(), `beforeend`);
render(tripEventsSectionElement, createEditingPointFormTemplate(generatePoint()), `beforeend`);

points.forEach((point) => render(tripEventsSectionElement, createPointTemplate(point), `beforeend`));


