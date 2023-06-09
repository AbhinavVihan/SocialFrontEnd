import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  createPostSuccess,
  createPostFailure,
  getFollowingPostsSuccess,
} from "../store/postSlice";
import { FETCH_USERS } from "../store/userSlice";
import { BASE_URL } from "../helpers/api";

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
      `${BASE_URL}/posts/create`,
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

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
  };
  try {
    // Make the API call using axios

    const response = yield call(
      axios.get,
      `${BASE_URL}/posts/getFollowingPosts`,
      config
    );

    // Dispatch a success action with the response data
    yield put({ type: FETCH_USERS });
    yield put(getFollowingPostsSuccess(response.data));
  } catch (error) {
    // Dispatch a failure action with the error
  }
}

function* likePost(action: any): Generator<any, void, any> {
  const { postId } = action.payload;

  // Set the authorization header in the axios instance

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
    params: { postId },
  };
  try {
    // Make the API call using axios

    yield axios.get(`${BASE_URL}/posts/like`, config);

    yield put({ type: FTECH_FOLLOWED_POSTS });
    yield put({ type: FETCH_USERS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
  }
}

function* unlikePost(action: any): Generator<any, void, any> {
  const { postId } = action.payload;

  // Set the authorization header in the axios instance

  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
    params: { postId },
  };
  try {
    // Make the API call using axios

    yield axios.get(`${BASE_URL}/posts/unlike`, config);
    yield put({ type: FTECH_FOLLOWED_POSTS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
  }
}

function* addComment(action: any): Generator<any, void, any> {
  const { postId, content } = action.payload;

  console.log(content);
  const config = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    },
  };
  try {
    // Make the API call using axios

    yield axios.post(
      `${BASE_URL}/posts/addComment`,
      { postId, content },
      config
    );

    yield put({ type: FTECH_FOLLOWED_POSTS });

    // Dispatch a success action with the response data
  } catch (error) {
    // Dispatch a failure action with the error
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
