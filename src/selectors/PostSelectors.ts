import { RootState } from "../store/types";
import { createSelector } from "reselect";

// Select the entire user state
const selectPostState = (state: RootState) => state.posts;

// Select the currentUser from the user state
// export const selectCurrentUser = createSelector(
//   [selectPostState],
//   (users) => users.currentUser
// );

// Select all users from the user state
export const selectAllPosts = createSelector(
  [selectPostState],
  (posts) => posts.followedPosts
);
