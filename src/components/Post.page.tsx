import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  COMMENT_ONPOST,
  FTECH_FOLLOWED_POSTS,
  LIKE_POST,
  UNLIKE_POST,
} from "../sagas/postSaga";
import { selectAllPosts } from "../selectors/PostSelectors";
import { selectAllUsers, selectCurrentUser } from "../selectors/UserSelectors";
import { dateSorter, formatDate } from "../helpers/formattedDate";
import { Post } from "../store/postSlice";
import Loading from "./Loading";

const PostPage = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const posts = useSelector(selectAllPosts);
  const users = useSelector(selectAllUsers);
  const currentUser = useSelector(selectCurrentUser);

  const handleLike = (postId: string) => {
    dispatch({ type: LIKE_POST, payload: { postId } });
  };

  const handleUnlike = (postId: string) => {
    dispatch({ type: UNLIKE_POST, payload: { postId } });
  };

  const handleComment = (postId: string) => {
    dispatch({ type: COMMENT_ONPOST, payload: { postId, content: comment } });
    setComment("");
  };

  useEffect(() => {
    dispatch({ type: FTECH_FOLLOWED_POSTS });
  }, [dispatch]);

  const shouldShowLikeButton = (currPostId: string) => {
    const post = posts?.find((post) => post._id === currPostId);
    const liked = post?.likes.includes(currentUser?._id ?? "");
    return liked;
  };

  const createPostLink = (noPost?: boolean) => (
    <Link
      to="/createPost"
      className={`"text-blue-500 hover:text-blue-700 bg-transparent hover:bg-blue-500 hover:bg-opacity-25 border border-black hover:border-blue-700 rounded-full px-4 py-2 transition-colors duration-300 ease-in-outflex flex-col items-center justify-center ${
        noPost && "mt-5"
      } hover:text-gray-900 font-bold`}
    >
      {noPost && "Or"} Create your own Post
    </Link>
  );

  if (posts?.length === 0) {
    return <Loading />;
  } else if (!posts) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600 mb-4">
            Sorry, no posts yet. Try following some users.
          </p>
          <Link
            to="/users"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Go to Users Page
          </Link>
        </div>
        <div className="flex justify-center">{createPostLink(true)}</div>
      </div>
    );
  }

  const authorLink = (post: Post) => {
    const user = users.find((u) => u._id === post.author);
    return (
      <Link className="hover:text-blue-500" to={`/users/${post.author}`}>
        {user?.userName}
      </Link>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center flex-col items-center mb-4 gap-4 sticky top-20 bg-white shadow mx-auto py-4 px-8">
        <Link
          to="/users"
          className="text-blue-500 hover:text-blue-700 bg-transparent hover:bg-blue-500 hover:bg-opacity-25 border border-black hover:border-blue-700 rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"
        >
          Users
        </Link>
        {createPostLink()}
      </div>
      <div className="grid gap-6 mx-auto max-w-screen-lg">
        {dateSorter(posts).map((post) => (
          <div
            key={post._id}
            className="bg-gray-100 rounded-lg border shadow p-4"
          >
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex justify-center">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-auto h-52 object-cover mb-4 rounded-lg"
              />
            </div>
            <p className="text-lg font-bold mb-2">Author: {authorLink(post)}</p>
            <p className="text-gray-600 text-sm mb-2">
              {formatDate(post.createdAt)}
            </p>
            <p className="mb-4">{post.content}</p>
            <div className="flex items-center justify-between">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() =>
                  shouldShowLikeButton(post._id)
                    ? handleUnlike(post._id)
                    : handleLike(post._id)
                }
              >
                {shouldShowLikeButton(post._id) ? "Unlike" : "Like"}
              </button>
              <div className="flex items-center">
                <span className="mr-2">Likes: {post.likes.length}</span>
                <span className="mr-2">Comments: {post.comments.length}</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded py-2 px-4"
                placeholder="Add a comment..."
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleComment(post._id)}
              >
                Comment
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">Comments</h2>
              {post.comments.map((comment, index) => (
                <p key={index} className="mb-2">
                  <Link
                    className="font-bold hover:text-blue-500"
                    to={`/users/${comment.author._id}`}
                  >
                    {comment.author.userName}
                  </Link>{" "}
                  :{comment.content}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
