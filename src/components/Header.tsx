import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../selectors/UserSelectors";

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  const showUserLink = !["/signup", "/", `/users/*`].includes(
    location.pathname
  );

  const handleGoBack = () => {
    if (currentUser && location.pathname.includes("posts")) {
      return;
    }
    navigate(-1); // Go back to the previous page
  };
  return showUserLink ? (
    <header className="sticky top-0 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-8">
        <button
          onClick={handleGoBack}
          className="text-blue-500 hover:text-blue-700"
        >
          Back
        </button>
        {!location.pathname.includes(`${currentUser?._id}`) && (
          <Link
            to={`/users/${currentUser?._id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <div className="flex items-center gap-2">
              <img
                src={currentUser?.imageUrl}
                alt={currentUser?.userName}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span>{currentUser?.userName}</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  ) : null;
};
export default Header;
