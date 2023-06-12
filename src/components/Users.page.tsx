import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_USERS, FOLLOW_USER, UNFOLLOW_USER } from "../store/userSlice";
import { selectAllUsers, selectCurrentUser } from "../selectors/UserSelectors";
import { useNavigate, Link } from "react-router-dom";

const UsersPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: FETCH_USERS });
  }, [dispatch]);

  const handleFollow = (userIdToFollow: string) => {
    dispatch({ type: FOLLOW_USER, payload: { userIdToFollow } });
  };

  const handleUnfollow = (userIdToUnFollow: string) => {
    dispatch({ type: UNFOLLOW_USER, payload: { userIdToUnFollow } });
  };

  const shouldShowFollowButon = (userIdToFollow: string) => {
    const user = users.find((user) => user._id === currentUser?._id);
    const isFollowing = user?.following.includes(userIdToFollow);
    return isFollowing;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center sticky top-20 h-10 bg-white mx-auto">
        <Link
          to="/posts"
          className="text-green-500 hover:text-green-700 bg-transparent hover:bg-green-500 hover:bg-opacity-25 border border-black hover:border-green-700 rounded-full px-4 py-2 transition-colors duration-300 ease-in-out"
        >
          Browse posts
        </Link>
      </div>
      <h1 className="text-2xl flex mt-4 justify-center font-bold mb-4">
        Here is the list of all the users
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users
          .filter((user) => user._id !== currentUser?._id)
          .map((user: any) => (
            <div key={user._id} className="border-black rounded-lg shadow p-4">
              <img
                src={user.imageUrl}
                alt={user.userName}
                className="w-full h-40 object-cover mb-4 rounded-lg cursor-pointer"
                onClick={() => navigate(`/users/${user._id}`)}
              />
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">{user.userName}</p>
                <button
                  onClick={() =>
                    shouldShowFollowButon(user._id)
                      ? handleUnfollow(user._id)
                      : handleFollow(user._id)
                  }
                  className={`px-4 py-2 ${
                    shouldShowFollowButon(user._id)
                      ? "bg-gray-500 hover:bg-gray-800"
                      : "bg-blue-500 hover:bg-blue-800"
                  } text-white rounded-full hover:outline-none transition-colors duration-300`}
                >
                  {shouldShowFollowButon(user._id) ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UsersPage;
