import firebase, { firestore } from "../firebase";
import { NADE_LIMIT, FILTERS, MAPS, NADES, sortObject } from "../constants";

const nadesAndMaps = [...sortObject(NADES, 1), ...sortObject(MAPS, 1)];
const filterSort = ["movement", "rating", "feature", "tickrate", "team"];

// Converts the filter state into a search parameter
export const encodeSearchParam = (filterState) => {
  let tempSearch = "1";

  // Converts the state to an integer and appends it to the search parameter
  nadesAndMaps.forEach(nadeMap => tempSearch += +filterState[nadeMap.id]);

  // Iterates through the list of filter types
  filterSort.forEach(filterKey => {
    const filterType = FILTERS[filterKey];

    // Converts the state to an integer and appends it to the search parameter
    filterType.forEach(filter => {
      const id = `${filterKey}-${filter.id}`;
      tempSearch += +filterState[id];
    });
  });

  // Pads the binary value to evenly convert to hexadecimal
  // The number of the filters must be a multiple of 4
  tempSearch += "000";

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
    state.sort = +searchParam[0];

    // Extracts the nade and map values
    nadesAndMaps.forEach((nadeMap, index) => {
      // Converts the binary value to a boolean
      state[nadeMap.id] = !!+tempSearch[index];
    });

    // Removes the processed characters from the search parameter
    tempSearch = tempSearch.slice(nadesAndMaps.length);

    filterSort.forEach(filterKey => {
      const filterType = FILTERS[filterKey];

      // Extracts the other filter type values
      filterType.forEach((filter, index) => {
        const id = `${filterKey}-${filter.id}`;

        // Converts the binary value to a boolean
        state[id] = !!+tempSearch[index];
      });

      // Removes the processed characters from the search parameter
      tempSearch = tempSearch.slice(filterType.length);
    });
  }

  return state;
};

// Builds a Firestore query from the search parameter
export const buildSearchQuery = (searchParam) => {
  let nadeListRef = firestore.collection("nades").where("status", "==", "public");

  // Sorts the nade list by the Firestore document ID
  const nadeSort = firebase.firestore.FieldPath.documentId();

  // Determines the order of the nade list
  const nadeOrder = searchParam ? (!!+searchParam[0] ? "asc" : "desc") : "desc";

  if (!searchParam) return nadeListRef.orderBy(nadeSort, nadeOrder).limit(NADE_LIMIT);

  // Converts the hexadecimal string to binary
  let tempSearch = parseInt("1" + searchParam.slice(1), 16).toString(2).slice(1);

  // Extracts the nade query
  const nadeLength = sortObject(NADES, 1).length;
  const nadeQuery = tempSearch.slice(0, nadeLength);

  if (+nadeQuery) {
    nadeListRef = nadeListRef.where(`nades.${nadeQuery}`, "==", true);
  }

  // Removes the processed characters
  tempSearch = tempSearch.slice(nadeLength);

  // Extracts the map query
  const mapLength = sortObject(MAPS, 1).length;
  const mapQuery = tempSearch.slice(0, mapLength);

  if (+mapQuery) {
    nadeListRef = nadeListRef.where(`maps.${mapQuery}`, "==", true);
  }

  // Removes the processed characters
  tempSearch = tempSearch.slice(mapLength);

  // Iterates through the list of filter types
  filterSort.forEach(filterKey => {
    const filterLength = FILTERS[filterKey].length;
    const filterQuery = tempSearch.slice(0, filterLength);

    // Checks for selected filters
    // Chains where() methods for the filter type
    if (+filterQuery) {
      if ("rating" === filterKey) {
        // Reverses the query string to prioritize the minimum rating
        const ratingQuery = filterQuery.split("").reverse().join("");

        // Removes the leading zeros and returns the length
        const tempRating = (+ratingQuery).toString().length;

        // The minimum star rating for the grenade
        const starRating = (filterLength - tempRating) + 1;

        nadeListRef = nadeListRef.where(`rating.${starRating}-star`, "==", true);
      }
      else if ("feature" === filterKey) {
        nadeListRef = nadeListRef.where("feature.oneway", "==", true);
      }
      else {
        nadeListRef = nadeListRef.where(`${filterKey}.${filterQuery}`, "==", true);
      }
    }

    // Removes the processed characters
    tempSearch = tempSearch.slice(filterLength);
  });

  return nadeListRef.orderBy(nadeSort, nadeOrder).limit(NADE_LIMIT);
};

// Returns a list of the user's grenade collections in Firestore
export const getUserCollections = (userUid) => {
  // Returns an empty list if there is no user
  if (!userUid) return [];

  const userRef = firestore.doc(`users/${userUid}`);

  // Performs the Firestore query
  return userRef.get().then(user => {
    if (!user.exists) return [];

    const collections = user.data().collections;
    if (!collections) return [];

    const collKeys = Object.keys(collections);
    const collList = collKeys.map(key => ({ id: key, title: collections[key] }));

    // Sorts the collections by the title
    collList.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      return (aTitle > bTitle) - (aTitle < bTitle);
    });

    return collList;
  }).catch(error => {
    console.log(error);
    return [];
  });
};