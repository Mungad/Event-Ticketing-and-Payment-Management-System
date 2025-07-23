import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the correct EventType
export type EventType = {
  eventId: number;
  title: string;
  description: string;
  venueId: number;
  category: string;
  startDate: string;
  endDate: string;
  ticketPrice: string;
  ticketsTotal: number;
  ticketsSold: number;
  createdAt?: string;
  updatedAt?: string;
};

// Type for creating an event (no eventId)
export type CreateEventType = Omit<EventType, "eventId" | "createdAt" | "updatedAt" | "ticketsSold">;

// Type for updating an event (eventId required, rest optional)
export type UpdateEventType = Pick<EventType, "eventId"> & Partial<Omit<EventType, "eventId">>;

interface EventState {
  events: EventType[];
  allEvents: EventType[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  allEvents: [],
  loading: false,
  error: null,
};

// Helper: transform snake_case to camelCase
const transformEvent = (event: any): EventType => ({
  eventId: event.event_id,
  title: event.title,
  description: event.description,
  venueId: event.venue_id,
  category: event.category,
  startDate: event.start_date,
  endDate: event.end_date,
  ticketPrice: event.ticket_price,
  ticketsTotal: event.tickets_total,
  ticketsSold: event.tickets_sold,
  createdAt: event.created_at,
  updatedAt: event.updated_at,
});

// Async Thunks
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await axios.get("http://localhost:8088/events");
  return response.data.map(transformEvent);
});

export const addEvent = createAsyncThunk("events/addEvent", async (newEvent: CreateEventType) => {
  const response = await axios.post("http://localhost:8088/events", newEvent);
  return transformEvent(response.data);
});

export const updateEvent = createAsyncThunk("events/updateEvent", async (updatedEvent: UpdateEventType) => {
  const { eventId, ...updateData } = updatedEvent;
  const response = await axios.put(`http://localhost:8088/events/${eventId}`, updateData);
  return transformEvent(response.data);
});

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (eventId: number) => {
  await axios.delete(`http://localhost:8088/events/${eventId}`);
  return eventId;
});

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    resetEventFilter: (state) => {
      state.events = [...state.allEvents];
    },
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.events = state.allEvents.filter(event => event.category === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<EventType[]>) => {
        state.loading = false;
        state.events = action.payload;
        state.allEvents = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })

      // Add Event
      .addCase(addEvent.fulfilled, (state, action: PayloadAction<EventType>) => {
        state.events.push(action.payload);
        state.allEvents.push(action.payload);
      })

      // Update Event
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<EventType>) => {
        const index = state.events.findIndex(e => e.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
          const allIndex = state.allEvents.findIndex(e => e.eventId === action.payload.eventId);
          if (allIndex !== -1) state.allEvents[allIndex] = action.payload;
        }
      })

      // Delete Event
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
        state.events = state.events.filter(e => e.eventId !== action.payload);
        state.allEvents = state.allEvents.filter(e => e.eventId !== action.payload);
      });
  },
});

export const { resetEventFilter, filterByCategory } = eventSlice.actions;
export default eventSlice.reducer;
