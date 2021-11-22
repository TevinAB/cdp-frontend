import React, { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";

import { SEARCH_TYPE } from "../../../constants/ProjectConstants";

import { FilterPopup } from "../../Filters/FilterPopup";
import useFilter from "../../Filters/useFilter";
import { FilterState } from "../../Filters/reducer";
import { getDateText, SelectDateRange } from "../../Filters/SelectDateRange";
import { getSelectedOptions, SelectTextFilterOptions } from "../../Filters/SelectTextFilterOptions";
import { screenWidths } from "../../../styles/mediaBreakpoints";
import { strings } from "../../../assets/LocalizedStrings";

import "@councildataproject/cdp-design/dist/colors.css";
import "@mozilla-protocol/core/protocol/css/protocol.css";
import "@mozilla-protocol/core/protocol/css/protocol-components.css";

const EXAMPLE_TOPICS = [
  "minimum wage",
  "police budget",
  "rent control",
  "municipal broadband",
  "police accountability",
  "homelessness response",
  "municipal broadband, digital equity",
  "sodo stadium",
  "35 ave bike lane",
  "capitol hill megablock",
];

const gridContainer = `
  display: grid;
  column-gap: 8px;
  row-gap: 4px;
  /**One column template*/
  grid-template-columns: 1fr;
  justify-content: start;
`;

const SearchContainer = styled.div`
  ${gridContainer}
  @media (min-width: ${screenWidths.tablet}) {
    /**Two columns template, with the first column taking up any free space*/
    grid-template-columns: 1fr auto;
  }
`;

const SearchInput = styled.input`
  margin-bottom: 0px !important;
`;

const SearchExampleTopic = styled.p`
  padding-top: 0px !important;
  font-size: 0.775rem !important;
  @media (min-width: ${screenWidths.tablet}) {
    /**Make the example topic appear after the search button*/
    order: 1;
  }
`;

const FiltersContainer = styled.div`
  ${gridContainer}
  @media (min-width: ${screenWidths.tablet}) {
    /**Three columns template, with the last column taking up any free space*/
    grid-template-columns: auto auto 1fr;
  }
`;

const AdvancedOptionsBtn = styled.button`
  @media (min-width: ${screenWidths.tablet}) {
    /**Make the advanced options button appear last*/
    order: 1;
    /**Float the button to the right*/
    justify-self: end;
  }
`;

const searchTypeOptions = [
  {
    name: SEARCH_TYPE.MEETING,
    label: "Meetings",
    disabled: false,
  },
  {
    name: SEARCH_TYPE.LEGISLATION,
    label: "Legislation",
    disabled: false,
  },
  {
    name: SEARCH_TYPE.COUNCIL_MEMBER,
    label: "Council Members",
    disabled: false,
  },
];

const intialSearchTyperFilterState = {
  [SEARCH_TYPE.MEETING]: true,
  [SEARCH_TYPE.LEGISLATION]: true,
  [SEARCH_TYPE.COUNCIL_MEMBER]: true,
};

const getSearchTypeText = (checkboxes: FilterState<boolean>, defaultText: string) => {
  const selectedCheckboxes = Object.keys(checkboxes).filter((key) => checkboxes[key]);
  let textRep = defaultText;
  if (selectedCheckboxes.length === Object.keys(checkboxes).length) {
    textRep += "(s): All";
  } else if (selectedCheckboxes.length > 0) {
    const selectedLabels = selectedCheckboxes.map((name) => {
      const option = searchTypeOptions.find((option) => option.name === name);
      return option?.label ?? "";
    });
    textRep += `(s): ${selectedLabels.join(", ")}`;
  }
  return textRep;
};

const exampleSearchQuery = EXAMPLE_TOPICS[Math.floor(Math.random() * EXAMPLE_TOPICS.length)];

const HomeSearchBar: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const history = useHistory();
  const dateRangeFilter = useFilter<string>({
    name: "Date",
    initialState: { start: "", end: "" },
    defaultDataValue: "",
    textRepFunction: getDateText,
  });
  const searchTypeFilter = useFilter<boolean>({
    name: "Search Type",
    initialState: intialSearchTyperFilterState,
    defaultDataValue: false,
    textRepFunction: getSearchTypeText,
    isRequired: true,
  });

  const onSearch: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const queryParams = `?q=${searchQuery.trim().replace(/\s+/g, "+")}`;
    const selectedSearchTypes = getSelectedOptions(searchTypeFilter.state);
    history.push({
      pathname: "/search",
      search: queryParams,
      state: {
        query: searchQuery.trim(),
        types: selectedSearchTypes,
        committees: [],
        dateRange: dateRangeFilter.state,
      },
    });
  };

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearchQuery(event.target.value);

  const onClickFilters = () => setShowFilters((showFilters) => !showFilters);

  return (
    <>
      <form className="mzp-c-form" role="search" onSubmit={onSearch}>
        <SearchContainer>
          <SearchInput
            type="search"
            placeholder={strings.search_topic_placeholder}
            required
            aria-required
            disabled={!searchTypeFilter.isActive()}
            value={searchQuery}
            onChange={onSearchChange}
          />
          <SearchExampleTopic className="mzp-c-field-info">
            {strings.example_prefix}
            {exampleSearchQuery}
          </SearchExampleTopic>
          <button
            className="mzp-c-button mzp-t-product"
            type="submit"
            disabled={!searchTypeFilter.isActive()}
          >
            {strings.search}
          </button>
        </SearchContainer>
      </form>

      <FiltersContainer>
        <AdvancedOptionsBtn
          className="mzp-c-button mzp-t-secondary"
          onClick={onClickFilters}
          disabled={!searchTypeFilter.isActive()}
        >
          {strings.advanced_options}
        </AdvancedOptionsBtn>
        <div>
          {showFilters && (
            <FilterPopup
              name={searchTypeFilter.name}
              clear={searchTypeFilter.clear}
              getTextRep={searchTypeFilter.getTextRep}
              isActive={searchTypeFilter.isActive}
              popupIsOpen={searchTypeFilter.popupIsOpen}
              setPopupIsOpen={searchTypeFilter.setPopupIsOpen}
              closeOnChange={false}
              hasRequiredError={searchTypeFilter.hasRequiredError()}
            >
              <SelectTextFilterOptions
                name={searchTypeFilter.name}
                state={searchTypeFilter.state}
                update={searchTypeFilter.update}
                options={searchTypeOptions}
              />
            </FilterPopup>
          )}
        </div>
        <div>
          {showFilters && (
            <FilterPopup
              name={dateRangeFilter.name}
              clear={dateRangeFilter.clear}
              getTextRep={dateRangeFilter.getTextRep}
              isActive={dateRangeFilter.isActive}
              popupIsOpen={dateRangeFilter.popupIsOpen}
              setPopupIsOpen={dateRangeFilter.setPopupIsOpen}
              closeOnChange={false}
            >
              <SelectDateRange state={dateRangeFilter.state} update={dateRangeFilter.update} />
            </FilterPopup>
          )}
        </div>
      </FiltersContainer>
    </>
  );
};

export default HomeSearchBar;