import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetProjectCalendar } from "services/ProjectService";

export const getEvents = createAsyncThunk("projectCalendar/data/getEvents", async (data) => {
  const response = await apiGetProjectCalendar(data);
  return response.data;
});

const dataSlice = createSlice({
  name: "projectCalendar/data",
  initialState: {
    loading: false,
    eventList: [],
  },
  reducers: {
    updateEvent: (state, action) => {
      state.eventList = action.payload;
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: (state, action) => {
      state.eventList = action.payload;
    },
  },
});

export const { updateEvent } = dataSlice.actions;

export default dataSlice.reducer;
