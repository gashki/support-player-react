import React, { Component } from "react";
import { FILTERS, MAPS, NADES, sortObject } from "../../constants";
import { decodeSearchParam } from "../Query";

// React components
import { FilterSelect, FilterCheckbox, FilterRating } from "./Form";


class Filters extends Component {
  constructor(props) {
    super(props);

    const searchParam = props.contentState || "";

    // The state of the filters based on the search parameter
    const filterState = decodeSearchParam(searchParam);

    this.state = { ...filterState };
  }

  render() {
    const filterState = this.state;

    // The properties for the sort filter
    const sortFilter = {
      id: "sort",
      options: ["Most Recent", "Most Viewed", "Top Rated"],
      value: filterState.sort
    };

    const filters = {};

    const nadeSort = sortObject(NADES);
    nadeSort.forEach(nade => {
      // The properties for each nade filter
      const { id, title } = nade;
      const filterKey = "nade";
      const value = filterState[id];

      // Appends the nade filters
      const tempFilter = filters[filterKey] || [];
      tempFilter.push({ id, title, value });
      filters[filterKey] = tempFilter;
    });

    const mapSort = sortObject(MAPS);
    mapSort.forEach(map => {
      // The properties for each map filter
      const { id, title } = map;
      const filterKey = "map";
      const value = filterState[id];

      // Appends the map filters
      const tempFilter = filters[filterKey] || [];
      tempFilter.push({ id, title, value });
      filters[filterKey] = tempFilter;
    });

    const filterKeys = Object.keys(FILTERS);
    // Iterates through the list of filter types
    filterKeys.forEach(filterKey => {
      const filterType = FILTERS[filterKey];

      // Builds a list of filters for the filter type
      filterType.forEach(filter => {
        const id = `${filterKey}-${filter.id}`;
        const title = filter.title;
        const value = filterState[id];

        // Appends the filter types
        const tempFilter = filters[filterKey] || [];
        tempFilter.push({ id, title, value });
        filters[filterKey] = tempFilter;
      });
    });

    return (
      <form className="sidebar-filters">
        <FilterSelect
          legend="Sort"
          input={sortFilter.id}
          options={sortFilter.options}
          value={sortFilter.value}
        />
        <FilterCheckbox legend="Type" options={filters.nade} />
        <FilterCheckbox legend="Map" options={filters.map} />
        <FilterCheckbox legend="Movement" options={filters.movement} />
        <FilterRating options={filters.rating} />
        <FilterCheckbox legend="Feature" options={filters.feature} />
        <FilterCheckbox legend="Tick Rate" options={filters.tickrate} />
        <FilterCheckbox legend="Team" options={filters.team} />
      </form>
    );
  }
}


export default Filters;
