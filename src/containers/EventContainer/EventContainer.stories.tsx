import React from "react";
import { Story, Meta } from "@storybook/react";

import EventContainer, { EventContainerProps } from "./EventContainer";

import { MATTER_STATUS_DECISION, VOTE_DECISION } from "../../constants/ProjectConstants";
import { SentenceWithSessionIndex } from "./types";

export default {
  component: EventContainer,
  title: "Library/Containers/Event",
} as Meta;

const Template: Story<EventContainerProps> = (args) => <EventContainer {...args} />;

const sentences: SentenceWithSessionIndex[] = [];
for (let sessionIndex = 0; sessionIndex < 2; sessionIndex++) {
  for (let sentenceIndex = 0; sentenceIndex < 10; sentenceIndex++) {
    sentences.push({
      session_index: sessionIndex,
      index: sessionIndex * 10 + sentenceIndex,
      start_time: sentenceIndex,
      text: `This is a sentence ${sessionIndex * 10 + sentenceIndex}.`,
      speaker_index: sentenceIndex,
      speaker_name: `Speaker ${sentenceIndex}`,
    });
  }
}

export const event = Template.bind({});
event.args = {
  initialSession: 0,
  initialSeconds: 123,
  event: {
    body: { name: "City Council" },
    event_datetime: new Date(),
  },
  sessions: [
    {
      video_uri: "https://video.seattle.gov/media/council/council_113020_2022091V.mp4",
      session_index: 1,
      session_datetime: new Date(0),
    },
    {
      video_uri: "https://video.seattle.gov/media/council/econ_090821_2602120V.mp4",
      session_index: 2,
      session_datetime: new Date(3600000),
    },
  ],
  sentences: sentences,
  eventMinutesItems: [
    {
      minutes_item: { name: "test" },
    },
    {
      id: "test2",
      minutes_item: { name: "test2", description: "test desc", matter: { id: "matter-id" } },
      decision: MATTER_STATUS_DECISION.REJECTED,
      files: [
        {
          name: "file name",
          uri: "https://www.seattle.gov/images/Council/Members/Herbold/Herbold_225x225.jpg",
        },
      ],
    },
  ],
  votes: [
    {
      id: "1",
      decision: VOTE_DECISION.APPROVE,
      person: {
        id: "1",
        name: "person name 1",
      },
      event_minutes_item_ref: "test2",
    },
    {
      id: "2",
      decision: VOTE_DECISION.REJECT,
      person: {
        id: "2",
        name: "person name 2",
      },
      event_minutes_item_ref: "test2",
    },
    {
      id: "3",
      decision: VOTE_DECISION.REJECT,
      person: {
        id: "3",
        name: "person name 3",
      },
      event_minutes_item_ref: "test2",
    },
  ],
};
