import {
  generateRandomDate,
  generateRandomDateAfter,
  getRandomInteger,
  getRandomItemFromArray,
  getRandomItemsFromArray
} from "../utils/utils";
import {
  DESCRIPTION_MATERIAL,
  MAX_PHOTO_URL_NUMBER,
  MAX_PRICE,
  PHOTOS_COUNT,
  POINT_TYPES,
} from "./data";
import dayjs from "dayjs";
import Points from "../model/points";

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const getDestinationInfo = (town) => ({
  description: getRandomItemsFromArray(DESCRIPTION_MATERIAL.split(` `)).join(` `),
  photos: Array(getRandomInteger(0, PHOTOS_COUNT - 1)).fill(``)
    .map(() => `http://picsum.photos/248/152?r=${getRandomInteger(MAX_PHOTO_URL_NUMBER)}`),
  town,
});

// export const generatePoint = () => {
//   const point = {
//     id: generateId(),
//     price: getRandomInteger(0, MAX_PRICE),
//     destination: getDestinationInfo(getRandomItemFromArray(TOWNS)),
//     isFavorite: Boolean(getRandomInteger()),
//   };
//   point.type = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];
//   const filteredOffers = getOffersForType(point.type);
//   point.offers = filteredOffers.length ? getRandomItemsFromArray(filteredOffers) : [];
//   point.startTime = generateRandomDate();
//   point.endTime = generateRandomDateAfter(point.startTime);
//   point.duration = dayjs(point.startTime).diff(point.endTime, `minute`);
//   return point;
// };

export const getOffersForType = (type) => {
  const allOffers = Points.getOffers();
  const filteredOffers = allOffers.find((offer) => offer.type.toLowerCase() === type.toLowerCase()).offers;
  return filteredOffers;
};

export const getOffersForTypeForClient = (type) => getOffersForType(type).map((offer) => Points.adaptOfferToClient(offer));
export const getDestinationNames = () => Points.getDestinations().map((destination) => destination.name);
