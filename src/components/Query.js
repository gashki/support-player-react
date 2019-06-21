import { FILTERS, MAPS, NADES, sortObject } from "../constants";

const nadesAndMaps = [...sortObject(NADES), ...sortObject(MAPS)];
const filterSort = ["movement", "rating", "feature", "tickrate", "team"];

// Converts the filter state into a search parameter
export const encodeSearchParam = (filterState) => {
  let tempSearch = "1";

  // Converts the value to an integer and appends it to the search parameter
  nadesAndMaps.forEach(nadeMap => tempSearch += +filterState[nadeMap.id]);

  // Iterates through the list of filter types
  filterSort.forEach(filterKey => {
    const filterType = FILTERS[filterKey];

    // Converts the value to an integer and appends it to the search parameter
    filterType.forEach(filter => {
      const id = `${filterKey}-${filter.id}`;
      tempSearch += +filterState[id];
    });
  });

  // Converts the binary string to hexadecimal
  const hexadecimal = parseInt(tempSearch, 2).toString(16).toLowerCase();
  const searchParam = "" + filterState.sort + hexadecimal.slice(1);

  return searchParam;
};

// Converts the search parameter into a filter state
export const decodeSearchParam = (searchParam) => {
  const state = {};

  if (!searchParam) {
    state.sort = 0;

    // Initializes the nade filters
    const nadeKeys = Object.keys(NADES);
    nadeKeys.forEach(key => state[key] = false);

    // Initializes the map filters
    const mapKeys = Object.keys(MAPS);
    mapKeys.forEach(key => state[key] = false);

    // Initializes the other filter types
    const filterKeys = Object.keys(FILTERS);
    filterKeys.forEach(key => {
      const filters = FILTERS[key];
      filters.forEach(filter => state[`${key}-${filter.id}`] = false);
    });
  }
  else {
    // Converts the hexadecimal string to binary
    let tempSearch = parseInt("1" + searchParam.slice(1), 16).toString(2).slice(1);

    // Extracts the value of the sort filter
    state.sort = +searchParam.charAt(0);

    // Extracts the nade and map values
    nadesAndMaps.forEach((nadeMap, index) => {
      // Converts the string to a boolean
      state[nadeMap.id] = !!+tempSearch.charAt(index);
    });

    // Removes the processed characters from the search parameter
    tempSearch = tempSearch.slice(nadesAndMaps.length);

    filterSort.forEach(filterKey => {
      const filterType = FILTERS[filterKey];

      // Extracts the other filter type values
      filterType.forEach((filter, index) => {
        const id = `${filterKey}-${filter.id}`;

        // Converts the string to a boolean
        state[id] = !!+tempSearch.charAt(index);
      });

      // Removes the processed characters from the search parameter
      tempSearch = tempSearch.slice(filterType.length);
    });
  }

  return state;
};

export const buildSearchQuery = () => {

};