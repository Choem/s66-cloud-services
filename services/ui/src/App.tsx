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
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CREATE_EVENT_MUTATION } from "./lib/mutations";

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

  // Mutations
  const [createEventMutation, { data }] = useMutation(CREATE_EVENT_MUTATION);

  // Other states
  const [totalState, setTotalState] = useState<number>(0);
  const [eventsState, setEventsState] = useState<Event[]>([]);

  const createEvent = async (mutationType: MutationType) => {
    await createEventMutation({ variables: { mutationType } });

    setEventsState([
      ...eventsState,
      {
        id: data.id,
        mutationType,
        createdAt: data.createdAt,
        applied: data.applied,
      },
    ]);
  };

  useEffect(() => {
    setTotalState(statistic.total);
    setEventsState(events);
  }, [events, statistic]);

  if (isFindAllEventsQueryLoading || isFindStatisticByIdQueryLoading) {
    return <CircularProgress />;
  }

  if (findAllEventsQueryHasError || findStatisticByIdQueryHasError) {
    return <span>An error has occurred. Please try again</span>;
  }

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Grid container spacing={1} style={{ height: "100%" }}>
        <Grid item xs={8}>
          <div
            style={{
              height: "100%",
              padding: "5px",
              backgroundColor: "#272c34",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "300px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                style={{
                  color: "#fff",
                  backgroundColor: "#1976d2",
                }}
                aria-label="remove"
                onClick={() => createEvent(MutationType.SUBTRACTION)}
              >
                <RemoveIcon />
              </IconButton>
              <span style={{ color: "#fff", fontSize: "22px" }}>
                {totalState}
              </span>
              <IconButton
                style={{
                  color: "#fff",
                  backgroundColor: "#1976d2",
                }}
                aria-label="add"
                onClick={() => createEvent(MutationType.ADDITION)}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div
            style={{
              height: "100%",
              backgroundColor: "#272c34",
              padding: "5px",
            }}
          >
            {!eventsState.length ? (
              <span>There are no events yet.</span>
            ) : (
              <ul style={{ listStyle: "none" }}>
                {eventsState.map((event, index) => (
                  <li
                    style={{ color: event.applied ? "green" : "red" }}
                    key={index}
                  >
                    {event.mutationType} - {event.createdAt}
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
