import { FILTERS, MAPS, NADES } from "../constants";

// Converts the filter state into a search parameter
export const encodeSearchParam = () => {

};

// Converts the search parameter into a filter state
export const decodeSearchParam = (searchParam) => {
  const state = {};

  if (!searchParam) {
    state.sort = 0;

    const mapKeys = Object.keys(MAPS);
    mapKeys.forEach(key => state[key] = false);

    const nadeKeys = Object.keys(NADES);
    nadeKeys.forEach(key => state[key] = false);

    const filterKeys = Object.keys(FILTERS);
    filterKeys.forEach(key => {
      const filters = FILTERS[key];
      filters.forEach(filter => state[`${key}-${filter.id}`] = false);
    });
  }

  return state;
};

export const buildSearchQuery = () => {

};