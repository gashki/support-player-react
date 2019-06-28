import React, { Component } from "react";
import { FILTERS, MAPS, NADES, sortObject } from "../../constants";
import { encodeSearchParam, decodeSearchParam } from "../Query";

// React components
import { FilterSelect, FilterCheckbox, FilterRating } from "./Form";


class Filters extends Component {
  constructor(props) {
    super(props);

    const searchParam = props.contentState;

    // The state of the filters based on the search parameter
    const filterState = decodeSearchParam(searchParam);

    this.state = { ...filterState };
  }

  componentDidUpdate(prevProps) {
    const prevSearchParam = prevProps.contentState;
    const nextSearchParam = this.props.contentState;

    // Checks if the filter state needs to be updated
    if (prevSearchParam !== nextSearchParam) {
      const filterState = decodeSearchParam(nextSearchParam);
      this.setState({ ...filterState });
    }
  }

  // Sets the state of an input
  handleChange = (input, value) => {
    const changeState = this.props.changeState;
    const filterState = { ...this.state };

    // Updates the filter value
    filterState[input] = value;

    // Encodes a search parameter based on the updated state
    const searchParam = encodeSearchParam(filterState);
    const filterParam = "/?filters=" + searchParam;

    changeState("contentMain", { type: "NadeList", state: searchParam }, filterParam);
  };

  render() {
    const filterState = { ...this.state };
    const handleChange = this.handleChange;

    // The properties for the sort filter
    const sortFilter = {
      id: "sort",
      options: ["Most Recent", "Most Viewed", "Top Rated"],
      value: filterState.sort
    };

    const filters = {};

    // Builds a list of nade filters
    const nadeSort = sortObject(NADES, 1);
    nadeSort.forEach(nade => {
      // The properties for the nade filter
      const { id, title } = nade;
      const filterKey = "nade";
      const value = filterState[id];

      // Appends the nade fitler to the nade list
      const tempFilter = filters[filterKey] || [];
      tempFilter.push({ id, title, value });
      filters[filterKey] = tempFilter;
    });

    // Builds a list of map filters
    const mapSort = sortObject(MAPS, 0);
    mapSort.forEach(map => {
      // The properties for the map filter
      const { id, title } = map;
      const filterKey = "map";
      const value = filterState[id];

      // Appends the map fitler to the map list
      const tempFilter = filters[filterKey] || [];
      tempFilter.push({ id, title, value });
      filters[filterKey] = tempFilter;
    });

    // Iterates through the list of filter types
    const filterKeys = Object.keys(FILTERS);
    filterKeys.forEach(filterKey => {
      const filterType = FILTERS[filterKey];

      // Builds a list of filters for the filter type
      filterType.forEach(filter => {
        const id = `${filterKey}-${filter.id}`;
        const title = filter.title;
        const value = filterState[id];

        // Appends the fitler to the filter type list
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
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Type"
          options={filters.nade}
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Map"
          options={filters.map}
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Movement"
          options={filters.movement}
          onChange={handleChange}
        />
        <FilterRating
          options={filters.rating}
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Feature"
          options={filters.feature}
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Tick Rate"
          options={filters.tickrate}
          onChange={handleChange}
        />
        <FilterCheckbox
          legend="Team"
          options={filters.team}
          onChange={handleChange}
        />
      </form>
    );
  }
}


export default Filters;
