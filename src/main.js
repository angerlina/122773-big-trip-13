import Menu from "./view/menu";
import {render, RenderPosition} from "./utils/render";
import PointListPresenter from "./presenter/point-list-presenter";
import Points from "./model/points";
import Filter from "./model/filter";
import FilterPresenter from "./presenter/filter-presenter";
import {FilterType, MenuItem, UpdateType} from "./const";
import Statistics from "./view/statistics";
import Api from "./api";
import RouteInfoPresenter from "./presenter/route-info-presenter";
import TripCostPresenter from "./presenter/trip-cost-presenter";
const AUTHORIZATION = `Basic ${Math.random().toString(36).substring(7)}`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);


const tripMainElement = document.querySelector(`.trip-main`);
const controlsMainElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const siteMenuComponent = new Menu();

const pointsModel = new Points();
const filtersModel = new Filter();
const pointListPresenter = new PointListPresenter(tripEventsContainer, pointsModel, filtersModel, api);
const filterPresenter = new FilterPresenter(controlsMainElement, filtersModel, pointsModel);
const routeInfoPresenter = new RouteInfoPresenter(tripMainElement, pointsModel);
const tripCostPresenter = new TripCostPresenter(tripMainElement, pointsModel);
const statisticsComponent = new Statistics();

statisticsComponent.hide();
siteMenuComponent.setMenuItem(MenuItem.TABLE);

const showPointsTable = () => {
  pointListPresenter.show();
  statisticsComponent.hide();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      showPointsTable();
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
  showPointsTable();
  pointListPresenter.createPoint();
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


pointListPresenter.init();
tripCostPresenter.init();
routeInfoPresenter.init();
filterPresenter.init();

const handleErrorInDataLoad = () => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(controlsMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
};


api.getOffers()
  .then((offers) => Points.setOffers(offers))
  .then(() => api.getDestinations())
  .then((destinations) => Points.setDestinations(destinations))
  .then(() => api.getPoints())
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripEventsContainer, statisticsComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  }
  ).catch(handleErrorInDataLoad);

render(controlsMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
