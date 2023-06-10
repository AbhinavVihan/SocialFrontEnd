import { createSlice } from "@reduxjs/toolkit";

interface PostState {
  post: any;
  error: string | null;
  loading: boolean;
  followedPosts: Post[] | null;
  taggedPosts:
    | {
        _id: string;
        title: string;
        content: string;
        author: {
          _id: string;
          userName: string;
        };
        imageUrl: string;
        createdAt: string;
      }[]
    | null;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  comments: Comment[];
  likes: string[];
  __v: number;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    userName: string;
  };
  post: string;
  createdAt: string;
  __v: number;
}

const initialState: PostState = {
  post: null,
  error: null,
  loading: false,
  followedPosts: null,
  taggedPosts: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    createPostRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.loading = false;
      state.post = action.payload;
    },
    createPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPost: (state) => {
      state.post = null;
      state.error = null;
      state.loading = false;
    },
    getFollowingPostsSuccess: (state, action) => {
      state.followedPosts = action.payload;
    },
    getTaggedPostsSuccess: (state, action) => {
      state.taggedPosts = action.payload;
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
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  resetPost,
  getFollowingPostsSuccess,
  getTaggedPostsSuccess,
  setError,
  setLoading,
} = postSlice.actions;

export default postSlice.reducer;
