import AbstractView from "./abstract-view";
import {FilterType} from "../const";

export const createFiltersTemplate = (filter) => {
  return `<form class="trip-filters" action="#" method="get">
              <div class="trip-filters__filter">
                <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${filter === FilterType.EVERYTHING ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
              </div>

              <div class="trip-filters__filter">
                <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${filter === FilterType.FUTURE ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-future">Future</label>
              </div>

              <div class="trip-filters__filter">
                <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${filter === FilterType.PAST ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-past">Past</label>
              </div>

              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
};

export default class Filters extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }
  getTemplate() {
    return createFiltersTemplate(this._filter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

}
