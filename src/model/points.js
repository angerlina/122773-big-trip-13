import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, newPoint) {
    const index = this._points.findIndex((point) => point.id === newPoint.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      newPoint,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, newPoint);
  }

  addPoint(updateType, newPoint) {
    this._points = [
      newPoint,
      ...this._points
    ];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointToDelete) {
    const index = this._points.findIndex((point) => point.id === pointToDelete.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          startTime: point.date_from !== null ? new Date(point.date_from) : point.date_from,
          endTime: point.date_to !== null ? new Date(point.date_to) : point.date_to,
          isFavorite: point.is_favorite,
          price: point.base_price,
          duration: point.date_from && point.date_to ? dayjs(point.date_to).diff(point.date_from, `minute`) : 0,
          offers: point.offers.map((serverOffer) => Points.adaptOfferToClient(serverOffer)),
          destination: Points.adaptDestinationToClient(point.destination)
        }
    );
    delete point.base_price;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    return adaptedPoint;
  }


  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "date_from": point.startTime instanceof Date ? point.startTime.toISOString() : null,
          "date_to": point.endTime instanceof Date ? point.endTime.toISOString() : null,
          "is_favorite": point.isFavorite || false,
          "base_price": Number(point.price),
          "offers": point.offers.map((offer) => Points.adaptOfferToServer(offer)),
          "destination": Points.adaptDestinationToServer(point.destination)
        }
    );
    delete adaptedPoint.startTime;
    delete adaptedPoint.endTime;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;
    delete adaptedPoint.duration;
    return adaptedPoint;
  }

  static adaptOfferToClient(offer) {
    return {cost: offer.price, name: offer.title};
  }


  static adaptOfferToServer(offer) {
    return {price: offer.cost, title: offer.name};
  }


  static adaptDestinationToClient(destination) {
    return {
      town: destination.name,
      description: destination.description,
      photos: destination.pictures.map((photo) => photo.src)
    };
  }


  static adaptDestinationToServer(clientDestination) {
    return Points.getDestinations().find((destination) => clientDestination.town === destination.name);
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static getOffers() {
    return this._offers;
  }


  static setDestinations(destinations) {
    this._destinations = destinations;
  }

  static getDestinations() {
    return this._destinations;
  }
}
