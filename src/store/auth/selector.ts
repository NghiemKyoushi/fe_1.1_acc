import { createSelector } from "reselect";

import { RootState } from "../../reducers/rootReducer";

const getPending = (state: RootState) => state.auth.pending;

const getToken = (state: RootState) => state.auth.token;

const getError = (state: RootState) => state.auth.error;

export const getAuthSelector = createSelector(getToken, (token) => token);

export const getPendingSelector = createSelector(
  getPending,
  (pending) => pending
);

export const getErrorSelector = createSelector(getError, (error) => error);