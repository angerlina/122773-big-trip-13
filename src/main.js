import {createRouteInfoTemplate} from "./view/route-info";
import {createTripCostTemplate} from "./view/trip-cost";
import {createMenuTemplate} from "./view/menu";
import {createFiltersTemplate} from "./view/filters";
import {createSortTemplate} from "./view/sort";
import {createCreatingPointFormTemplate} from "./view/creating-form";
import {createEditingPointFormTemplate} from "./view/editing-form";
import {createPointTemplate} from "./view/point";

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsSectionElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripCostTemplate(), `afterbegin`);
render(tripMainElement, createRouteInfoTemplate(), `afterbegin`);
render(controlsMainElement, createMenuTemplate(), `afterbegin`);
render(controlsMainElement, createFiltersTemplate(), `beforeend`);
render(tripEventsSectionElement, createSortTemplate(), `beforeend`);
render(tripEventsSectionElement, createCreatingPointFormTemplate(), `beforeend`);
render(tripEventsSectionElement, createEditingPointFormTemplate(), `beforeend`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripEventsSectionElement, createPointTemplate(), `beforeend`);
}
