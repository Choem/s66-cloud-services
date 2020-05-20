import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { MutationType } from "./models/mutationType";
import { CircularProgress, IconButton, Grid } from "@material-ui/core";
import { Event } from "./models/event";
import {
  FIND_ALL_EVENTS_QUERY,
  FIND_STATISTIC_BY_ID_QUERY,
} from "./lib/queries";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { CREATE_EVENT_MUTATION } from "./lib/mutations";
import "./App.sass";
import {
  EVENT_STATUS_CHANGED_SUBSCRIPTION,
  STATISTIC_UPDATED_SUBSCRIPTION,
} from "./lib/subscriptions";
import { getEventColor } from "./lib/getEventColor";

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
  const { loading: isEventStatusChangedLoading } = useSubscription(
    EVENT_STATUS_CHANGED_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData: { data } }) => {
        setEventsState(
          eventsState.map((event) => {
            const foundIndex = data.findIndex(
              (entry: Event) => entry.id === event.id
            );

            if (foundIndex !== -1) {
              return { ...data[foundIndex] };
            }

            return event;
          })
        );
      },
    }
  );

  const { loading: isStatisticUpdatedLoading } = useSubscription(
    STATISTIC_UPDATED_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData: { data } }) => {
        setTotalState(data.total);
      },
    }
  );

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
      <Grid container spacing={1} className="grid">
        <Grid item xs={8}>
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
        </Grid>
        <Grid item xs={4}>
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
                    {index + 1}. {event.mutationType} - {event.createdAt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
