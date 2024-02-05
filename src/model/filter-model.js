import { FilterType } from '../consts';
import Observable from '../framework/observable';


export default class FilterModel extends Observable {
  #filter = null;
  #filterStatus = null;

  constructor () {
    super();
    this.#filter = FilterType.ALL;
  }

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
    this._notify(filter);
  }
}
