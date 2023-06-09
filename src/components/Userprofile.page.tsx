import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectUserById } from "../selectors/UserSelectors";
import { useNavigate, useParams } from "react-router-dom";
import { USER_BYID, logout } from "../store/userSlice";
import { COMMENT_ONPOST, LIKE_POST, UNLIKE_POST } from "../sagas/postSaga";
import { dateSorter, formatDate } from "../helpers/formattedDate";
import { selectAllPosts } from "../selectors/PostSelectors";
import Loading from "./Loading";

const UserProfilePage: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const userProfile = useSelector(selectUserById);
  const [comment, setComment] = useState("");
  const posts = useSelector(selectAllPosts);
  const currentUser = useSelector(selectCurrentUser);
  const [call, setCall] = useState(false);
  const navigate = useNavigate();
  const isCurrentUser = currentUser?._id === userId;

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
    const post = posts.find((post) => post._id === currPostId);
    const liked = post?.likes.includes(currentUser?._id ?? "");
    return liked;
  };

  const handleLogout = () => {
    // dispatch({ type: USER_LOGOUT });
    dispatch(logout());
    navigate("/");
  };

  if (!userProfile[userId!]) {
    return <Loading />;
  }

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const user = userProfile[userId!];

  return (
    <div className="container mx-auto py-8">
      <button
        className="text-blue-500 hover:text-blue-700 mb-4"
        onClick={handleGoBack}
      >
        Back
      </button>
      {currentUser?._id === userId && (
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{user.userName}</h1>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
      <div className="flex items-center flex-col">
        <div className="w-1/4 mb-4">
          <img
            src={user.imageUrl}
            alt="Profile Picture"
            className="rounded-full h-40 w-40 object-cover mx-auto"
          />
        </div>
        <div className="w-3/4">
          {/* <p className="text-lg mb-4">{user.bio}</p> */}
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
                            {comment.content}
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
