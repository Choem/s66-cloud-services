import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { MutationType } from "./models/mutationType";
import { CircularProgress, IconButton, Grid } from "@material-ui/core";
import { Event } from "./models/event";
import { API_URL } from "./lib/constants";

export function App() {
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
  const [hasErrorState, setHasErrorState] = useState<boolean>(false);
  const [totalState, setTotalState] = useState<number>(0);
  const [eventsState, setEventsState] = useState<Event[]>([]);

  const getTotal = async () => {
    try {
      setIsLoadingState(true);

      const apiResponse = await fetch(`${API_URL}/statistics`, {
        method: "GET",
      });
      const json = await apiResponse.json();

      setTotalState(json.data);
    } catch (e) {
      console.error(e);
      setHasErrorState(true);
    } finally {
      setIsLoadingState(false);
    }
  };

  const getEvents = async () => {};

  const createEvent = async (mutationType: MutationType) => {
    const apiResponse = await fetch(`${API_URL}/events`, {
      method: "POST",
      body: JSON.stringify({
        mutationType,
      }),
    });
    const json = await apiResponse.json();

    if (json.success) {
      const event: Event = json.data;

      setEventsState([
        ...eventsState,
        {
          id: event.id,
          mutationType,
          createdAt: event.createdAt,
          applied: event.applied,
        },
      ]);
    }
  };

  useEffect(() => {
    getTotal();
    getEvents();
  }, []);

  // if (isLoadingState) {
  //   return <CircularProgress />;
  // }

  // if (hasErrorState) {
  //   return <span>An error has occurred. Please try again</span>;
  // }

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
