import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import LoginPage from "./components/Login.page";
import SignupPage from "./components/Signup.page";
import UsersPage from "./components/Users.page";
import CreatePostPage from "./components/CreatePost.page";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_ME } from "./store/userSlice";
import PostPage from "./components/Post.page";
import UserProfilePage from "./components/Userprofile.page";
import { selectCurrentUser, selectMessage } from "./selectors/UserSelectors";
import Message from "./helpers/Message";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const message = useSelector(selectMessage);

  useEffect(() => {
    dispatch({ type: FETCH_ME });
  }, [dispatch]);

  const showUserLink = !["/signup", "/", `/users/${currentUser?._id}`].includes(
    location.pathname
  );

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 m-4">
        {showUserLink && (
          <Link
            to={`/users/${currentUser?._id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <div className="flex  items-center gap-2">
              <img
                src={currentUser?.imageUrl}
                alt={currentUser?.userName}
                className="w-12 h-12 object-cover mb-4 rounded-lg"
              />
              <span>{currentUser?.userName}</span>
            </div>
          </Link>
        )}
      </div>
      <div> {message && <Message text={message} duration={2000} />}</div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/posts" element={<PostPage />} />

        <Route path="/createPost" element={<CreatePostPage />} />
        <Route path="users/:userId" element={<UserProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
