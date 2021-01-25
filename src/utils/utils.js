import dayjs from "dayjs";
import {MAX_DATE_GAP} from "../mock/data";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItemFromArray = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getRandomItemsFromArray = (array) => {
  const arrayCopy = array.slice();
  const pickedItems = [];
  const count = getRandomInteger(1, array.length);
  for (let i = 0; i < count; i++) {
    const item = getRandomItemFromArray(arrayCopy);
    pickedItems.push(item);
    const index = arrayCopy.indexOf(item);
    arrayCopy.splice(index, 1);
  }
  return pickedItems;
};


export const getTripCost = (points) => {
  let cost = 0;
  points.forEach((point) => {
    cost += Number(point.price);
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
const randomizeHoursAndMinutes = (dayjsDate) => {
  return dayjsDate.add(getRandomInteger(0, 60), `hour`).add(getRandomInteger(0, 60), `minute`);
};

export const generateRandomDate = () => {
  const maxDaysGap = getRandomInteger(0, MAX_DATE_GAP);
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return randomizeHoursAndMinutes(dayjs().add(daysGap, `day`)).toDate();
};

export const generateRandomDateAfter = (date) => {
  return randomizeHoursAndMinutes(dayjs(date).add(getRandomInteger(0, MAX_DATE_GAP), `day`)).toDate();
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
