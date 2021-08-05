const NAVIGATION_ITEM_ACTIVE = 'main-navigation__item--active';
const isActiveClassName = (condition) => condition ? NAVIGATION_ITEM_ACTIVE : '';

const filterNameToTextContent = {
  all: 'All movies',
  watchlist: 'Watchlist',
  history: 'History',
  favorites: 'Favorites',
};

const createFilterCountTemplate = (count) => ` <span class="main-navigation__item-count">${count}</span>`;

const createFiltersTemplate = (filter, isChecked) => {
  const {name, count} = filter;
  const textContent = `${filterNameToTextContent[name]}${name !== 'all' ? createFilterCountTemplate(count) : ''}`;
  return `<a href="#${name}" class="main-navigation__item ${isActiveClassName(isChecked)}">${textContent}</a>`;
};

const createMainMenuTemplate = (filters = [], activeItem) => {
  const isStatsChecked = activeItem === 'stats';
  const filtersTemplate = filters.map((filter) => createFiltersTemplate(filter, filter.name === activeItem)).join('');
  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional ${isActiveClassName(isStatsChecked)}">Stats</a>
    </nav>
  `;
};

export {createMainMenuTemplate};
