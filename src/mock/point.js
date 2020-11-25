import {
  generateRandomDate,
  generateRandomDateAfter, getDuration,
  getRandomInteger,
  getRandomItemFromArray,
  getRandomItemsFromArray
} from "../utils";

const pointTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const towns = [`Лондон`, `Бат`, `Сайренсестер`, `Байбери`, `Уэст Лулворт`];
const descriptionMaterial = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const photosCount = 5;
const maxPhotoURLNumber = 30;
const maxPrice = 300;

const allOffers = {
  Taxi: [
    {
      name: `Uber`,
      cost: 10,
    }
  ],
  Train: [
    {
      name: `Drinks`,
      cost: 5,
    },
    {
      name: `Meal`,
      cost: 12,
    }
  ],
  Flight: [
    {
      name: `Luggage`,
      cost: `50`,
    },
    {
      name: `Choose seats`,
      cost: `10`,
    },
    {
      name: `Meal`,
      cost: `15`,
    },
  ]
};

const generateDestination = () => {
  const descriptionWords = descriptionMaterial.split(` `);
  const destination = {
    town: getRandomItemFromArray(towns),
    description: getRandomItemsFromArray(descriptionWords).join(` `),
    photos: new Array(getRandomInteger(0,photosCount - 1)).fill('')
      .map(() => `http://picsum.photos/248/152?r=${getRandomInteger(maxPhotoURLNumber)}`)
  };
  return destination;
};

export const generateTask = () => {
  const point = {
    price: getRandomInteger(0, maxPrice),
    destination: generateDestination(),
    isFavorite: Boolean(getRandomInteger()),
  };
  const type = pointTypes[getRandomInteger(0, pointTypes.length - 1)];
  let offers = [];
  if (allOffers[type] && allOffers[type].length) {
    offers = getRandomItemsFromArray(allOffers[type]);
  }
  const startTime = generateRandomDate();
  const endTime = generateRandomDateAfter(startTime);
  const duration = getDuration(startTime, endTime);
  const result = {...point, endTime, duration, offers };
  debugger;
  return result;
};
