import React, { FC, useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { Loader } from "semantic-ui-react";

import { useAppConfigContext } from "../../app";
import { ORDER_DIRECTION, OR_QUERY_LIMIT_NUM } from "../../networking/constants";
import EventService from "../../networking/EventService";

import { MeetingCard } from "../../components/Cards/MeetingCard";
import useFilter from "../../components/Filters/useFilter";
import { EventsFilter } from "../../components/Filters/EventsFilter";
import { getDateText } from "../../components/Filters/SelectDateRange";
import { getSortingText } from "../../components/Filters/SelectSorting";
import {
  getCheckboxText,
  getSelectedOptions,
} from "../../components/Filters/SelectTextFilterOptions";
import FetchCardsStatus from "../../components/Shared/FetchCardsStatus";
import PageContainer from "../../components/Shared/PageContainer";
import SearchBar from "../../components/Shared/SearchBar";
import SearchPageTitle from "../../components/Shared/SearchPageTitle";
import ShowMoreCards from "../../components/Shared/ShowMoreCards";
import { CardsContainer } from "../CardsContainer";
import useFetchEvents, { FetchEventsActionType } from "./useFetchEvents";
import { EventsData } from "./types";
import { SearchEventsState } from "../../pages/SearchEventsPage/types";
import { SEARCH_TYPE } from "../../pages/SearchPage/types";

import { strings } from "../../assets/LocalizedStrings";
import { FETCH_CARDS_BATCH_SIZE } from "../../constants/ProjectConstants";
import { screenWidths } from "../../styles/mediaBreakpoints";

const EventsContainer: FC<EventsData> = ({ bodies }: EventsData) => {
  const { firebaseConfig } = useAppConfigContext();

  const dateRangeFilter = useFilter<string>({
    name: "Date",
    initialState: { start: "", end: "" },
    defaultDataValue: "",
    textRepFunction: getDateText,
  });
  const committeeFilter = useFilter<boolean>({
    name: "Committee",
    initialState: bodies.reduce((obj, body) => {
      obj[body.id as string] = false;
      return obj;
    }, {} as Record<string, boolean>),
    defaultDataValue: false,
    textRepFunction: getCheckboxText,
    limit: OR_QUERY_LIMIT_NUM,
  });
  const sortFilter = useFilter<string>({
    name: "Sort",
    initialState: { by: "event_datetime", order: ORDER_DIRECTION.desc, label: "Newest first" },
    defaultDataValue: "",
    textRepFunction: getSortingText,
  });

  const fetchEventsFunctionCreator = useCallback(
    (batchSize: number, startAfterEventDate?: Date) => async () => {
      const eventService = new EventService(firebaseConfig);
      const events = await eventService.getEvents(
        batchSize,
        getSelectedOptions(committeeFilter.state),
        {
          start: dateRangeFilter.state.start ? new Date(dateRangeFilter.state.start) : undefined,
          end: dateRangeFilter.state.end ? new Date(dateRangeFilter.state.end) : undefined,
        },
        {
          by: sortFilter.state.by,
          order: sortFilter.state.order as ORDER_DIRECTION,
        },
        startAfterEventDate
      );
      const renderableEvents = await Promise.all(
        events.map((event) => {
          return eventService.getRenderableEvent(event);
        })
      );
      return Promise.resolve(renderableEvents);
    },
    [firebaseConfig, committeeFilter.state, dateRangeFilter.state, sortFilter.state]
  );

  const isDesktop = useMediaQuery({ query: `(min-width: ${screenWidths.desktop})` });
  const [state, dispatch] = useFetchEvents(
    {
      batchSize: FETCH_CARDS_BATCH_SIZE - (isDesktop ? 1 : 0),
      events: [],
      fetchEvents: true,
      showMoreEvents: false,
      hasMoreEvents: false,
      error: null,
    },
    fetchEventsFunctionCreator
  );

  const history = useHistory<SearchEventsState>();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    const queryParams = `?q=${searchQuery.trim().replace(/\s+/g, "+")}`;

    history.push({
      pathname: `/${SEARCH_TYPE.EVENT}/search`,
      search: queryParams,
      state: {
        query: searchQuery.trim(),
        committees: committeeFilter.state,
        dateRange: dateRangeFilter.state,
      },
    });
  };

  const handlePopupClose = useCallback(() => {
    dispatch({ type: FetchEventsActionType.FETCH_EVENTS, payload: true });
  }, [dispatch]);

  const handleShowMoreEvents = useCallback(
    () => dispatch({ type: FetchEventsActionType.FETCH_EVENTS, payload: false }),
    [dispatch]
  );

  const fetchEventsResult = useMemo(() => {
    if (state.fetchEvents) {
      return <Loader active size="massive" />;
    } else if (state.error) {
      return <FetchCardsStatus>{state.error.toString()}</FetchCardsStatus>;
    } else if (state.events.length === 0) {
      return <FetchCardsStatus>No events found.</FetchCardsStatus>;
    } else {
      const cards = state.events.map((event) => {
        const eventDateTimeStr = event.event_datetime?.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) as string;
        return {
          link: `/${SEARCH_TYPE.EVENT}/${event.id}`,
          jsx: (
            <MeetingCard
              staticImgSrc={event.staticThumbnailURL}
              hoverImgSrc={event.hoverThumbnailURL}
              imgAlt={`${event.body?.name} - ${eventDateTimeStr}`}
              meetingDate={eventDateTimeStr}
              committee={event.body?.name as string}
              tags={event.keyGrams}
            />
          ),
        };
      });
      return <CardsContainer cards={cards} />;
    }
  }, [state.fetchEvents, state.error, state.events]);

  return (
    <PageContainer>
      <SearchPageTitle>
        <h1 className="mzp-u-title-sm">{strings.events}</h1>
        <SearchBar
          placeholder={strings.search_topic_placeholder}
          query={searchQuery}
          setQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </SearchPageTitle>
      <EventsFilter
        allBodies={bodies}
        filters={[committeeFilter, dateRangeFilter, sortFilter]}
        sortOptions={[
          { by: "event_datetime", order: ORDER_DIRECTION.desc, label: "Newest first" },
          { by: "event_datetime", order: ORDER_DIRECTION.asc, label: "Oldest first" },
        ]}
        handlePopupClose={handlePopupClose}
      />
      {fetchEventsResult}
      <ShowMoreCards isVisible={state.hasMoreEvents && !state.fetchEvents}>
        <button className="mzp-c-button mzp-t-secondary mzp-t-lg" onClick={handleShowMoreEvents}>
          <span>Show more events</span>
          <Loader inline active={state.showMoreEvents} size="tiny" />
        </button>
      </ShowMoreCards>
    </PageContainer>
  );
};

export default EventsContainer;
