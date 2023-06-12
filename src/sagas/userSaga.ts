import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_ME,
  FETCH_USERS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  USER_BYID,
  USER_LOGIN,
  USER_SIGNUP,
  fetchUserByIdSuccess,
  fetchUsersFailure,
  fetchUsersSuccess,
  login,
  setError,
  setLoading,
  setMe,
  setRedirect,
  startMessage,
} from "../store/userSlice";
import axios from "axios";
import { FTECH_FOLLOWED_POSTS } from "./postSaga";
import { BASE_URL } from "../helpers/api";

function* fetchMe(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = yield call(axios.get, `${BASE_URL}/user/me`, config);
    const { user } = response.data;
    yield put(setMe({ user }));
  } catch (error) {}
}

function* handleLogin(action: any): Generator<any, void, any> {
  const { userName, password } = action.payload;
  yield put(setLoading(true));
  try {
    const response = yield axios.post(`${BASE_URL}/user/login`, {
      userName,
      password,
    });

    if (response.status === 200) {
      const { token, user } = response.data;
      // Save the token in localStorage
      localStorage.setItem("token", token);
      // Login success
      yield put(login({ token, user }));
      yield put({ type: FTECH_FOLLOWED_POSTS });
      yield put(setRedirect(true)); // Set the redirect flag to true
      yield put(startMessage("logged in successfully"));
      yield put(setLoading(false));
    } else {
      // Handle login failure
    }
  } catch (error: any) {
    yield put(setLoading(false));

    yield put(setError(error.response.data.error));

    // Handle network or server errors
  }
}

function* handleSignup(action: any): Generator<any, void, any> {
  const { userName, email, password, image } = action.payload;
  yield put(setLoading(true));

  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    const response = yield axios.post(`${BASE_URL}/user/signup`, formData);

    if (response.status === 201) {
      // Signup success
      const { token, user } = response.data;
      // Store token in local storage
      localStorage.setItem("token", token);
      // yield put(signup({ token, user }));
      yield put(login({ token, user }));
      yield put(setRedirect(true)); // Set the redirect flag to true
      yield put(setLoading(false));
    } else {
      // Handle signup failure
    }
  } catch (error: any) {
    yield put(setLoading(false));

    yield put(setError(error.response.data.error));

    // Handle network or server errors
  }
}

function* handleFetchUsers(): Generator<any, void, any> {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = yield axios.get(`${BASE_URL}/user/users`, config);

    if (response.status === 200) {
      const users = response.data;
      yield put(fetchUsersSuccess(users.users));
    } else {
      yield put(fetchUsersFailure());
    }
  } catch (error) {
    yield put(fetchUsersFailure());
  }
}

function* handleFollowUser(action: any): Generator<any, void, any> {
  try {
    const { userIdToFollow } = action.payload;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    yield axios.post(`${BASE_URL}/user/follow`, { userIdToFollow }, config);
    yield put({ type: FETCH_USERS });
    yield put({ type: FTECH_FOLLOWED_POSTS });
  } catch (error) {
    // Handle error
    console.log("Error following user:", error);
  }
}

function* handleUnFollowUser(action: any): Generator<any, void, any> {
  try {
    const { userIdToUnFollow } = action.payload;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    yield axios.post(`${BASE_URL}/user/unfollow`, { userIdToUnFollow }, config);

    yield put({ type: FETCH_USERS });
    yield put({ type: FTECH_FOLLOWED_POSTS });
  } catch (error) {
    // Handle error
    console.log("Error following user:", error);
  }
}

function* getUserById(action: any): Generator<any, void, any> {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { userId } = action.payload;
    const response = yield call(
      axios.get,
      `${BASE_URL}/user/userById/?userId=${userId}`,
      config
    );

    const { user, posts } = response.data;
    yield put({ type: FETCH_USERS });
    yield put(fetchUserByIdSuccess({ user, posts }));
    yield put({ type: FTECH_FOLLOWED_POSTS });
  } catch (error) {}
}

function* userSaga() {
  yield takeEvery(FETCH_ME, fetchMe);
  yield takeEvery(USER_LOGIN, handleLogin);

  yield takeEvery(USER_SIGNUP, handleSignup);
  yield takeEvery(FETCH_USERS, handleFetchUsers);

  yield takeEvery(FOLLOW_USER, handleFollowUser);
  yield takeEvery(UNFOLLOW_USER, handleUnFollowUser);

  yield takeEvery(USER_BYID, getUserById);
}

export default userSaga;
