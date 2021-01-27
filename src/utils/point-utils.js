import dayjs from "dayjs";
import Points from "../model/points";

export const getOffersForType = (type) => {
  return Points.getOffers().find((offer) => offer.type.toLowerCase() === type.toLowerCase()).offers;
};

export const getOffersForTypeForClient = (type) => getOffersForType(type).map((offer) => Points.adaptOfferToClient(offer));

export const getDestinationNames = () => Points.getDestinations().map((destination) => destination.name);

export const getDestinationInfo = (destinationName) => Points.adaptDestinationToClient(
    Points.getDestinations().find((destination) => destination.name === destinationName)
);

export const getTripCost = (points) => {
  let cost = 0;
  points.forEach((point) => {
    cost += getPointCost(point);
  });
  return cost;
};

export const getPointCost = (point) => {
  let cost = point.price;
  point.offers.forEach((offer) => {
    cost += Number(offer.cost);
  });
  return cost;
};

export const getFormattedDuration = (startDate, endDate) => {
  const differenceInMinutes = dayjs(endDate).diff(startDate, `minute`);
  const differenceInHours = dayjs(endDate).diff(startDate, `hour`);
  const differenceInDays = dayjs(endDate).diff(startDate, `day`);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}M`;
  } if (differenceInDays < 1) {
    return `${differenceInHours}H ${differenceInMinutes % 60}M`;
  }
  return `${differenceInDays}D ${(differenceInHours - differenceInDays * 24) % 60}H ${differenceInMinutes % 60}M`;
};

export const getDuration = (startTime, endTime) => (dayjs(endTime).diff(startTime, `minute`));

export const formatToMonthDay = (date) => {
  return dayjs(date).format(`MMM D`);
};

export const formatToDateTime = (date) => {
  return dayjs(date).format(`DD/MM HH:mm`);
};

export const formatToDateTimeYear = (date) => {
  if (!date) {
    return ``;
  }
  return dayjs(date).format(`DD/MM/YY HH:mm`);
};

export const formatToTime = (date) => {
  return dayjs(date).format(`HH:mm`);
};

export const getStartEndDateTime = (startDateTime, endDateTime) => {
  if (dayjs(startDateTime).isSame(dayjs(endDateTime), `date`)) {
    return (`${formatToTime(startDateTime)}-${formatToTime(endDateTime)}`);
  } if (dayjs(startDateTime).isSame(dayjs(endDateTime), `year`)) {
    return (`${formatToDateTime(startDateTime)}-${formatToDateTime(endDateTime)}`);
  }
  return (`${formatToDateTimeYear(startDateTime)}-${formatToDateTimeYear(endDateTime)}`);
};


export const compare = (first, second) => {
  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }
  return 0;
};
