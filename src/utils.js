import dayjs from "dayjs";

const maxDateGap = 5;
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItemFromArray = (array) => {
  return array[getRandomInteger(0, array.length)];
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

export const generateRandomDate = () => {
  const maxDaysGap = getRandomInteger(0, maxDateGap);
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs().add(daysGap, `day`).toDate();
};

export const generateRandomDateAfter = (date) => {
  return dayjs(date).add(getRandomInteger(0, maxDateGap), `day`).toDate();
};

export const getDuration = (startDate, endDate) => {
  const differenceInMinutes = dayjs(endDate).diff(startDate, `minute`);
  const differenceInHours = dayjs(endDate).diff(startDate, `hour`);
  const differenceInDays = dayjs(endDate).diff(startDate, `day`);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}M`;
  } if (differenceInDays < 1) {
    return `${differenceInHours}H ${differenceInMinutes % 60}M`;
  } else {
    return `${differenceInDays}D ${(differenceInHours - differenceInDays * 24) % 60}H ${differenceInMinutes % 60}M`;
  }
};
