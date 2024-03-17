import { FilterType, UpdateType } from '../consts';
import Observable from '../framework/observable';


export default class FilterModel extends Observable {
  #filter = null;

  constructor () {
    super();
    this.#filter = FilterType.ALL;
  }

  get filter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notify(UpdateType.MINOR, filter);
  }
}
