import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/rootSaga";
import userReducer from "./userSlice";
import postReducer from "./postSlice";

const sagaMiddleware = createSagaMiddleware();

// Configure the Redux store
const store = configureStore({
  reducer: {
    users_all: userReducer,
    posts: postReducer,
  },
  middleware: [sagaMiddleware],
});

// Start the saga middleware
sagaMiddleware.run(rootSaga);

// Create a typed dispatch hook
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
