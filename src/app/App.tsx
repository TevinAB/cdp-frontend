import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import styled from "@emotion/styled";

import { useAppConfigContext } from "./AppConfigContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

import { Header } from "../components/Layout/Header";
import { Footer } from "../components/Layout/Footer";
import { HomePage } from "../pages/HomePage";
/* import { SearchPage } from "../pages/SearchPage"; */
import { SearchEventsPage } from "../pages/SearchEventsPage";
import { EventPage } from "../pages/EventPage";
import { EventsPage } from "../pages/EventsPage";
import { PersonPage } from "../pages/PersonPage";
import { PeoplePage } from "../pages/PeoplePage";

import { SEARCH_TYPE } from "../pages/SearchPage/types";

import { strings } from "../assets/LocalizedStrings";
import { screenWidths } from "../styles/mediaBreakpoints";

import "@councildataproject/cdp-design/dist/images.css";
import "@councildataproject/cdp-design/dist/colors.css";
import "@mozilla-protocol/core/protocol/css/protocol.css";
import "@mozilla-protocol/core/protocol/css/protocol-components.css";
import "semantic-ui-css/semantic.min.css";

const FlexContainer = styled.div({
  // The App takes up at least 100% of the view height
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

const Main = styled.main({
  boxSizing: "border-box",
  width: "100%",
  padding: "16px",
  // Main component takes up all of the remaining height of the flex container
  flex: 1,
  // Align center across the horizontal axis
  alignSelf: "center",
  display: "flex",
  flexDirection: "column",
  [`@media (min-width:${screenWidths.tablet})`]: {
    padding: "32px",
    maxWidth: "1280px",
  },
});

function App() {
  useDocumentTitle(strings.council_data_project);

  const { municipality } = useAppConfigContext();
  return (
    <>
      <Router basename="/">
        <FlexContainer>
          <Header municipalityName={municipality.name} />
          <Main>
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              {/* <Route exact path="/search">
                <SearchPage />
              </Route> */}
              <Route exact path={`/${SEARCH_TYPE.EVENT}`}>
                <EventsPage />
              </Route>
              <Route exact path={`/${SEARCH_TYPE.EVENT}/search`}>
                <SearchEventsPage />
              </Route>
              <Route exact path={`/${SEARCH_TYPE.EVENT}/:id`}>
                <EventPage />
              </Route>
              <Route exact path="/people">
                <PeoplePage />
              </Route>
              <Route exact path="/people/:id">
                <PersonPage />
              </Route>
            </Switch>
          </Main>
          <Footer footerLinksSections={municipality.footerLinksSections} />
        </FlexContainer>
      </Router>
    </>
  );
}

export default App;
