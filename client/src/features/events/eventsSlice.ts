import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TEvent } from '../../features/events/types';

export interface EventsState {
  allEvents: TEvent[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  allEvents: [],
  isLoading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<TEvent[]>) => {
      state.allEvents = action.payload;
    },
    addEvent: (state, action: PayloadAction<TEvent>) => {
      state.allEvents.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<TEvent>) => {
      const index = state.allEvents.findIndex(e => e.event_id === action.payload.event_id);
      if (index !== -1) {
        state.allEvents[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.allEvents = state.allEvents.filter(e => e.event_id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setLoading,
  setError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
