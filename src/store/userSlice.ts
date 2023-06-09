import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "./postSlice";

export const FETCH_ME = "fetch/me";
export const USER_LOGIN = "user/login";
export const USER_LOGOUT = "user/logout";
export const USER_SIGNUP = "user/signup";
export const FETCH_USERS = "fetch/users";
export const FOLLOW_USER = "follow/user";
export const UNFOLLOW_USER = "unfollow/user";
export const USER_BYID = "user/byid";
export const SET_REDIRECT = "set/redirect"; // New action for setting redirect flag

interface UserState {
  currentUser: User | null;
  users: User[];
  ById: { [id: string]: User };
  redirect: boolean;
  message: string | null;
  error: string | null;
  loading: boolean;
}

interface User {
  _id: string;
  userName: string;
  password: string;
  following: string[];
  imageUrl?: string;
  posts: Post[];
  __v: number;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  ById: {},
  redirect: false,
  message: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<{ user: User }>) => {
      state.currentUser = action.payload.user;
    },
    login: (state, action: PayloadAction<{ token?: string; user: User }>) => {
      state.currentUser = action.payload.user;
    },
    logout: (state) => {
      state.currentUser = null;
      state.redirect = false;
      localStorage.removeItem("token");
    },
    signup: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.currentUser = action.payload.user;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    fetchUsersFailure: (state) => {
      state.users = [];
    },
    fetchUserByIdSuccess: (state, action) => {
      state.ById = {
        [action.payload.user._id]: action.payload.user,
        posts: action.payload.posts,
      };
    },
    setRedirect: (state, action: PayloadAction<boolean>) => {
      state.redirect = action.payload;
    },
    startMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    stopMessage: (state) => {
      state.message = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setMe,
  login,
  logout,
  signup,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdSuccess,
  setRedirect,
  startMessage,
  stopMessage,
  setError,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;
