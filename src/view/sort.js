const SORT_ITEM_ACTIVE = 'sort__button--active';

const isActiveClassName = (condition) => condition ? SORT_ITEM_ACTIVE : '';

const createSortItemTemplate = (sortType, isChecked) => `
  <li>
    <a href="#${sortType}" class="sort__button ${isActiveClassName(isChecked)}">Sort by ${sortType}</a>
  </li>
`;

const createSortTemplate = (sortTypes = [], activeSortType) => {
  const sortItemsTemplate = sortTypes.map((sortType) => createSortItemTemplate(sortType, sortType === activeSortType)).join('');
  return `<ul class="sort">${sortItemsTemplate}</ul>`;
};

export {createSortTemplate};