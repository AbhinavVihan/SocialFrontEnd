import { RootState } from "../store/types";
import { createSelector } from "reselect";

// Select the entire user state
const selectUserState = (state: RootState) => state.users_all;

// Select the currentUser from the user state
export const selectCurrentUser = createSelector(
  [selectUserState],
  (users) => users.currentUser
);

// Select all users from the user state
export const selectAllUsers = createSelector(
  [selectUserState],
  (users) => users.users
);

// Select a user by ID
export const selectUserById = createSelector([selectUserState], (users) => {
  return users.ById;
});

export const selectMessage = createSelector([selectUserState], (users) => {
  return users.message;
});

export const selectError = createSelector(
  [selectUserState],
  (user) => user.error
);

export const selectLoading = createSelector(
  [selectUserState],
  (user) => user.loading
);
