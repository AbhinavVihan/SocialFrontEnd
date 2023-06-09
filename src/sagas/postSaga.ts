import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  createPostSuccess,
  createPostFailure,
  getFollowingPostsSuccess,
} from "../store/postSlice";
import { FETCH_USERS } from "../store/userSlice";

export const CREATE_POST = "post/createPost";
export const FTECH_FOLLOWED_POSTS = "fetch/followed_posts";
export const LIKE_POST = "like/post";
export const UNLIKE_POST = "unlike/post";

export const COMMENT_ONPOST = "comment/onpost";

function getTokenFromLocalStorage() {
  return localStorage.getItem("token");
}

function* handleCreatePost(action: any): Generator<any, void, any> {
  const { title, content, image, selectedTags } = action.payload;

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    selectedTags.map((tag: { label: string; value: string }, index: number) =>
      formData.append(`tags[${index}]`, tag.value)
    );

    const config = {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = yield axios.post(
      "http://localhost:3001/posts/create",
      formData,
      config
    );

    if (response.status === 201) {
      yield put(createPostSuccess(response.data));
    } else {
      yield put(createPostFailure("Failed to create post"));
    }
  } catch (error) {
    yield put(createPostFailure("Error creating post"));
  }
}

function* getFollowingPostsSaga(): Generator<any, void, any> {
  // Set the authorization header in the axios instance
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
  };
  try {
    // Make the API call using axios

    const response = yield call(
      axios.get,
      "http://localhost:3001/posts/getFollowingPosts",
      config
    );

    // Dispatch a success action with the response data
    yield put({ type: FETCH_USERS });
    yield put(getFollowingPostsSuccess(response.data));
  } catch (error) {
    // Dispatch a failure action with the error
    // yield put(getFollowingPostsFailure(error));
  }
}

function* likePost(action: any): Generator<any, void, any> {
  const { postId } = action.payload;

  // Set the authorization header in the axios instance
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
    params: { postId },
  };
  try {
    // Make the API call using axios

    yield axios.get("http://localhost:3001/posts/like", config);

    yield put({ type: FTECH_FOLLOWED_POSTS });
    yield put({ type: FETCH_USERS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
    // yield put(getFollowingPostsFailure(error));
  }
}

function* unlikePost(action: any): Generator<any, void, any> {
  const { postId } = action.payload;

  // Set the authorization header in the axios instance
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
    params: { postId },
  };
  try {
    // Make the API call using axios

    yield axios.get("http://localhost:3001/posts/unlike", config);
    yield put({ type: FTECH_FOLLOWED_POSTS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
    // yield put(getFollowingPostsFailure(error));
  }
}

function* addComment(action: any): Generator<any, void, any> {
  const { postId, content } = action.payload;

  // Set the authorization header in the axios instance
  // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  console.log(content);
  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
  };
  try {
    // Make the API call using axios

    yield axios.post(
      "http://localhost:3001/posts/addComment",
      { postId, content },
      config
    );

    yield put({ type: FTECH_FOLLOWED_POSTS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
    // yield put(getFollowingPostsFailure(error));
  }
}

function* postSaga() {
  yield takeEvery(CREATE_POST, handleCreatePost);
  yield takeEvery(FTECH_FOLLOWED_POSTS, getFollowingPostsSaga);
  yield takeEvery(LIKE_POST, likePost);
  yield takeEvery(UNLIKE_POST, unlikePost);

  yield takeEvery(COMMENT_ONPOST, addComment);
}

export default postSaga;
