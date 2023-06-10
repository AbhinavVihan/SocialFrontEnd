import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import LoginPage from "./components/Login.page";
import SignupPage from "./components/Signup.page";
import UsersPage from "./components/Users.page";
import CreatePostPage from "./components/CreatePost.page";
import { useDispatch } from "react-redux";
import { FETCH_ME } from "./store/userSlice";
import PostPage from "./components/Post.page";
import UserProfilePage from "./components/Userprofile.page";
import TaggedPosts from "./components/TaggedPosts";
import Header from "./components/Header";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: FETCH_ME });
  }, [dispatch]);

  return (
    <Router>
      <div className="relative">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/posts" element={<PostPage />} />
          <Route path="/tags" element={<TaggedPosts />} />

          <Route path="/createPost" element={<CreatePostPage />} />
          <Route path="users/:userId" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
