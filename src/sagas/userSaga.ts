import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_ME,
  FETCH_USERS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  USER_BYID,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGNUP,
  fetchUserByIdSuccess,
  fetchUsersFailure,
  fetchUsersSuccess,
  login,
  setMe,
  setRedirect,
  signup,
  startMessage,
} from "../store/userSlice";
import axios from "axios";
import { FTECH_FOLLOWED_POSTS } from "./postSaga";

function* fetchMe(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = yield call(
      axios.get,
      "http://localhost:3001/user/me",
      config
    );
    const { user } = response.data;
    yield put(setMe({ user }));

    // yield put(setMe(userData));
  } catch (error) {
    // yield put(setError(error.message));
  }
}

function* handleLogin(action: any): Generator<any, void, any> {
  const { userName, password } = action.payload;
  try {
    const response = yield axios.post("http://localhost:3001/user/login", {
      userName,
      password,
    });

    if (response.status === 200) {
      const { token, user } = response.data; // Assuming the token is returned in the response data
      // Save the token in localStorage
      localStorage.setItem("token", token);
      // Login success
      yield put(login({ token, user }));

      yield put(setRedirect(true)); // Set the redirect flag to true
      yield put(startMessage("logged in successfully"));

      // yield put(fetchUsers());
    } else {
      // Handle login failure
      // You can dispatch an action to update the state accordingly
    }
  } catch (error) {
    // Handle network or server errors
    // You can dispatch an action to update the state accordingly
  }
}

function* handleLogout(): Generator<any, void, any> {
  localStorage.removeItem("token");
  // yield put(logout());
}

function* handleSignup(action: any): Generator<any, void, any> {
  const { userName, email, password, image } = action.payload;
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image);

    const response = yield axios.post(
      "http://localhost:3001/user/signup",
      formData
    );

    if (response.status === 200) {
      // Signup success
      const { token, user } = response.data;
      // Store token in local storage
      localStorage.setItem("token", token);
      yield put(signup({ token, user }));
      yield put(login({ token, user }));
    } else {
      // Handle signup failure
      // You can dispatch an action to update the state accordingly
    }
  } catch (error) {
    // Handle network or server errors
    // You can dispatch an action to update the state accordingly
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
    const response = yield axios.get(
      "http://localhost:3001/user/users",
      config
    );

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

    yield axios.post(
      "http://localhost:3001/user/follow",
      { userIdToFollow },
      config
    );
    yield put({ type: FETCH_USERS });

    // Fetch updated user list after following user
    // yield put(fetchUsers());
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

    yield axios.post(
      "http://localhost:3001/user/unfollow",
      { userIdToUnFollow },
      config
    );

    yield put({ type: FETCH_USERS });

    // Fetch updated user list after following user
    // yield put(fetchUsers());
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
      `http://localhost:3001/user/userById/?userId=${userId}`,
      config
    );

    const { user, posts } = response.data; // Assuming the response contains the user object
    yield put({ type: FETCH_USERS });
    yield put(fetchUserByIdSuccess({ user, posts }));
    yield put({ type: FTECH_FOLLOWED_POSTS });
  } catch (error) {
    // yield put(fetchUserByIdFailure(error.message));
  }
}

function* userSaga() {
  yield takeEvery(FETCH_ME, fetchMe);
  yield takeEvery(USER_LOGIN, handleLogin);
  yield takeEvery(USER_LOGOUT, handleLogout);

  yield takeEvery(USER_SIGNUP, handleSignup);
  yield takeEvery(FETCH_USERS, handleFetchUsers);

  yield takeEvery(FOLLOW_USER, handleFollowUser);
  yield takeEvery(UNFOLLOW_USER, handleUnFollowUser);

  yield takeEvery(USER_BYID, getUserById);
}

export default userSaga;
