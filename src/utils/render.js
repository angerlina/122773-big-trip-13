import AbstractView from "../view/abstract-view";

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const getElement = (elementOrView) => ((elementOrView instanceof AbstractView) ? elementOrView.getElement() : elementOrView);


export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const replaceChild = (oldChild, newChild) => {
  const oldChildElement = getElement(oldChild);
  const parent = oldChildElement.parentElement;
  if (!parent || !oldChild || !newChild) {
    throw Error(`Нельзя заменить несуществующие компоненты!`);
  }
  getElement(parent).replaceChild(getElement(newChild), oldChildElement);
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


export const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};
