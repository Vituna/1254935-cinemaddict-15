import {removeComponent, render, replace} from '../utils/render.js';
import { filter } from '../utils/utils.js';
import {FilterType, InsertPosition, UpdateType} from '../utils/constants.js';

import MenuView from '../view/main-menu.js';
import UserProfileView from '../view/profile-user.js';

export default class Filter {
  constructor(headerContainer, filterContainer, filterModel, filmModel) {
    this._headerContainer = headerContainer;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmModel = filmModel;

    this._filterComponent = null;
    this._profileComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._filmModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const prevProfileComponent = this._profileComponent;

    this._filterComponent = new MenuView(filters, this._filterModel.getFilter());
    this._profileComponent = new UserProfileView(this._getWatchedFilmsCount());
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null && prevProfileComponent === null) {
      render(this._headerContainer, this._profileComponent, InsertPosition.BEFOREEND);
      render(this._filterContainer, this._filterComponent, InsertPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    replace(this._profileComponent, prevProfileComponent);
    removeComponent(prevFilterComponent);
    removeComponent(prevProfileComponent);
  }

  _modelEventHandler(updateType) {
    if (updateType === UpdateType.INIT) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    }
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getWatchedFilmsCount() {
    return this._getFilters().find((item) => item.type === FilterType.HISTORY).count;
  }

  _getFilters() {
    const films = this._filmModel.getFilms();

    return [
      {
        type: FilterType.ALL,
      },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        value: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
