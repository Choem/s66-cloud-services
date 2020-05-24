import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { MutationType } from "./models/mutationType";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Event } from "./models/event";
import {
  FIND_ALL_EVENTS_QUERY,
  FIND_STATISTIC_BY_ID_QUERY,
} from "./lib/queries";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { CREATE_EVENT_MUTATION } from "./lib/mutations";
import "./App.sass";
import {
  EVENTS_STATUS_CHANGED_SUBSCRIPTION,
  STATISTIC_UPDATED_SUBSCRIPTION,
} from "./lib/subscriptions";
import { getEventColor } from "./lib/getEventColor";
import {
  EventStatusChangedPayload,
  StatisticUpdatedPayload,
} from "./lib/payloads";
import Moment from "react-moment";

export function App() {
  // Queries
  const {
    loading: isFindAllEventsQueryLoading,
    error: findAllEventsQueryHasError,
    data: events,
  } = useQuery(FIND_ALL_EVENTS_QUERY);
  const {
    loading: isFindStatisticByIdQueryLoading,
    error: findStatisticByIdQueryHasError,
    data: statistic,
  } = useQuery(FIND_STATISTIC_BY_ID_QUERY);

  // Subscriptions
  const { loading: isEventStatusChangedLoading } = useSubscription<
    EventStatusChangedPayload
  >(EVENTS_STATUS_CHANGED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data) {
        const changedEvents = data.EVENTS_STATUS_CHANGED.changedEvents;
        setEventsState((prevState) => [
          ...prevState.map((prevEvent) => {
            const foundIndex = changedEvents.findIndex(
              (event) => event.id === prevEvent.id
            );

            if (foundIndex === -1) {
              return prevEvent;
            }

            return { ...prevEvent, ...changedEvents[foundIndex] };
          }),
        ]);
      }
    },
  });

  const { loading: isStatisticUpdatedLoading } = useSubscription<
    StatisticUpdatedPayload
  >(STATISTIC_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data) {
        setTotalState(data.STATISTIC_UPDATED.total);
      }
    },
  });

  // Mutations
  const [createEventMutation, { data: createdEvent }] = useMutation(
    CREATE_EVENT_MUTATION
  );

  // Other states
  const [totalState, setTotalState] = useState<number>(0);
  const [eventsState, setEventsState] = useState<Event[]>([]);

  const createEvent = async (mutationType: MutationType) => {
    try {
      await createEventMutation({ variables: { mutationType } });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (statistic && events) {
      setTotalState(statistic.findStatisticById.total);
      setEventsState(events.findAllEvents);
    }
  }, [statistic, events]);

  useEffect(() => {
    if (createdEvent) {
      const createdEventData = createdEvent.createEvent;
      setEventsState((prevState) => [
        {
          id: createdEventData.id,
          mutationType: createdEventData.mutationType,
          createdAt: createdEventData.createdAt,
          eventStatusType: createdEventData.eventStatusType,
        },
        ...prevState,
      ]);
    }
  }, [createdEvent, setEventsState]);

  if (isFindAllEventsQueryLoading || isFindStatisticByIdQueryLoading) {
    return (
      <div className="app-container loader">
        <CircularProgress color="primary" />
        <span>Loading data...</span>
      </div>
    );
  }

  if (findAllEventsQueryHasError || findStatisticByIdQueryHasError) {
    return (
      <div className="app-container error">
        <span>An error has occurred :( Please try again!</span>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="grid">
        <div className="grid__item left">
          <div className="counter">
            <IconButton
              className="button"
              aria-label="remove"
              onClick={() => createEvent(MutationType.SUBTRACTION)}
            >
              <RemoveIcon />
            </IconButton>
            <span className="total">{totalState}</span>
            <IconButton
              className="button"
              aria-label="add"
              onClick={() => createEvent(MutationType.ADDITION)}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
        <div className="grid__item right">
          <h2 className="grid__item__title">Events</h2>
          {!eventsState.length ? (
            <span>There are no events yet.</span>
          ) : (
            <ul>
              {eventsState.map((event, index) => (
                <li
                  style={{
                    marginBottom: "5px",
                    color: getEventColor(event.eventStatusType),
                  }}
                  key={index}
                >
                  <span>{eventsState.length - index}.</span>
                  <span>{event.mutationType}</span>
                  <span>
                    (
                    <Moment format="DD-MM-YYYY HH:mm:ss">
                      {event.createdAt}
                    </Moment>
                    )
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
