import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import LoginPage from "./components/Login.page";
import SignupPage from "./components/Signup.page";
import UsersPage from "./components/Users.page";
import CreatePostPage from "./components/CreatePost.page";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_ME } from "./store/userSlice";
import PostPage from "./components/Post.page";
import UserProfilePage from "./components/Userprofile.page";
import TaggedPosts from "./components/TaggedPosts";
import Header from "./components/Header";
import { selectCurrentUser } from "./selectors/UserSelectors";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    dispatch({ type: FETCH_ME });
  }, [dispatch]);

  useEffect(() => {
    setIsAuthenticated(!!currentUser); // Update authentication status when currentUser changes
  }, [currentUser]);

  return (
    <Router>
      <div className="relative">
        {isAuthenticated && <Header />}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/posts" element={<PostPage />} />
              <Route path="/tags" element={<TaggedPosts />} />
              <Route path="/createPost" element={<CreatePostPage />} />
              <Route path="users/:userId" element={<UserProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
