import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllUsers,
  selectCurrentUser,
  selectUserById,
} from "../selectors/UserSelectors";
import { Link, useNavigate, useParams } from "react-router-dom";
import { USER_BYID, logout, setError } from "../store/userSlice";
import { COMMENT_ONPOST, LIKE_POST, UNLIKE_POST } from "../sagas/postSaga";
import { dateSorter, formatDate } from "../helpers/formattedDate";
import Loading from "./Loading";

const UserProfilePage: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const userProfile = useSelector(selectUserById);
  const [comment, setComment] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  const [call, setCall] = useState(false);
  const navigate = useNavigate();
  const isCurrentUser = currentUser?._id === userId;
  const allUsers = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch({ type: USER_BYID, payload: { userId } });
  }, [call, userId, dispatch]);

  const handleLike = (postId: string) => {
    dispatch({ type: LIKE_POST, payload: { postId } });
    dispatch({ type: USER_BYID, payload: { userId } });

    setCall(!call);
  };

  const handleUnlike = (postId: string) => {
    dispatch({ type: UNLIKE_POST, payload: { postId } });
    dispatch({ type: USER_BYID, payload: { userId } });

    setCall(!call);
  };

  const handleComment = (postId: string) => {
    dispatch({ type: COMMENT_ONPOST, payload: { postId, content: comment } });
    dispatch({ type: USER_BYID, payload: { userId } });

    setComment("");
    setCall(!call);
  };

  const shouldShowLikeButton = (currPostId: string) => {
    const post = user.posts?.find((post) => post._id === currPostId);
    const liked = post?.likes.includes(currentUser?._id ?? "");

    return liked;
  };
  const author = (authorId: string) => {
    return allUsers.find((u) => u._id === authorId);
  };

  const handleLogout = () => {
    dispatch(setError(""));
    dispatch(logout());
    navigate("/");
  };

  const user = userProfile[userId!];

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4 text-center sticky top-12 bg-white mx-auto">
        <h1 className="text-3xl font-bold">{user.userName}</h1>
        {isCurrentUser && (
          <>
            <Link
              to="/tags"
              className="text-blue-500 sm:ml-16 lg:mr-8 lg:ml-0 hover:text-blue-700 bg-transparent hover:bg-blue-500 hover:bg-opacity-25 border border-blue-500 hover:border-blue-700 rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"
            >
              Tags
            </Link>
            <button
              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-red-500 hover:bg-opacity-25 border border-red-500 hover:border-red-700 rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-1/2 sm:w-1/4 mb-4">
          <img
            src={user.imageUrl}
            alt="Profile Picture"
            className="rounded-full h-40 w-40 object-cover mx-auto"
          />
        </div>
        <div className="w-full sm:w-3/4">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          {user.posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {dateSorter(user.posts).map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-100 rounded-lg border shadow p-4"
                >
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <div className="flex justify-center">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-auto h-52 object-cover mb-4 rounded-lg"
                    />
                  </div>
                  <p className="text-gray-600">{post.content}</p>
                  <p className="text-gray-600">{formatDate(post.createdAt)}</p>
                  {!isCurrentUser && (
                    <div>
                      <div className="flex items-center justify-between mt-4">
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
                          <span className="mr-2">
                            Likes: {post.likes.length}
                          </span>
                          <span className="mr-2">
                            Comments: {post.comments.length}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded py-2 px-4"
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleComment(post._id)}
                        >
                          Add Comment
                        </button>
                      </div>
                      <div className="mt-4">
                        <h2 className="text-lg font-bold mb-2">Comments</h2>
                        {post.comments.map((comment: any, index: number) => (
                          <p key={index} className="mb-2">
                            <Link
                              className="font-bold hover:text-blue-500"
                              to={`/users/${comment.author}`}
                            >
                              {author(comment.author)?.userName}
                            </Link>{" "}
                            :{comment.content}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No posts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
