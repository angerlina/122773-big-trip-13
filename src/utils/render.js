import AbstractView from "../view/AbstractView";

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const getElement = (elementOrViewObject) => ((elementOrViewObject instanceof AbstractView) ? elementOrViewObject.getElement() : elementOrViewObject);


export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const replaceChild = (oldChild, newChild) => {
  const newChildElement = getElement(newChild);
  const parent = newChildElement.parentElement;
  if (!parent || !oldChild || !newChild) {
    throw Error(`Нельзя заменить несуществующие компоненты!`);
  }
  getElement(parent).replaceChild(getElement(oldChild), newChildElement);
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      getElement(container).prepend(getElement(element));
      break;
    case RenderPosition.BEFOREEND:
      getElement(container).append(getElement(element));
      break;
  }
};
