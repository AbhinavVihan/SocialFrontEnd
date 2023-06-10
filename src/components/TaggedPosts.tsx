import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FTECH_TAGGED_POSTS } from "../sagas/postSaga";
import { selectTaggedPosts } from "../selectors/PostSelectors";
import { formatDate } from "../helpers/formattedDate";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const TaggedPosts: React.FC = () => {
  const dispatch = useDispatch();
  const taggedPosts = useSelector(selectTaggedPosts);

  useEffect(() => {
    dispatch({ type: FTECH_TAGGED_POSTS });
  }, [dispatch]);

  if (!taggedPosts) {
    return <Loading />;
  } else if (taggedPosts?.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600 mb-4">
            You were'nt tagged in any posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl flex justify-center font-bold mb-4">
        These are the posts that you were tagged in
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taggedPosts?.map((post) => (
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
            <p className="text-lg  font-bold mb-2">
              Author :{" "}
              <Link
                className="hover:text-blue-500"
                to={`/users/${post.author._id}`}
              >
                {post.author.userName}
              </Link>
            </p>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-gray-600">{formatDate(post.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaggedPosts;
