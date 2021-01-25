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
import {FilterType, MenuItem, UpdateType} from "./const";
import Statistics from "./view/statistics";

const points = Array(POINT_COUNT).fill().map(generatePoint);
const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const siteMenuComponent = new Menu();
render(tripMainElement, new TripCost(points), RenderPosition.AFTERBEGIN);
render(tripMainElement, new RouteInfo(points), RenderPosition.AFTERBEGIN);
render(controlsMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const pointsModel = new Points();
pointsModel.setPoints(points);
const filtersModel = new Filter();
const pointListPresenter = new PointListPresenter(tripEventsContainer, pointsModel, filtersModel);
const filterPresenter = new FilterPresenter(controlsMainElement, filtersModel, pointsModel);
let statisticsComponent = new Statistics(pointsModel.getPoints());
statisticsComponent.hide();
siteMenuComponent.setMenuItem(MenuItem.TABLE);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      pointListPresenter.show();
      statisticsComponent.hide();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      statisticsComponent.show();
      pointListPresenter.hide();
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent.setCharts(pointsModel.getPoints());
      break;
  }
};

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  pointListPresenter.createPoint();
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

pointListPresenter.init();
render(tripEventsContainer, statisticsComponent, RenderPosition.AFTERBEGIN);
filterPresenter.init();

