import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { USER_SIGNUP, setError, setRedirect } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/types";
import { selectError, selectLoading } from "../selectors/UserSelectors";

const SignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirect = useSelector((state: RootState) => state.users_all.redirect);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const handleSignup = (values: any) => {
    const { userName, email, password } = values;
    dispatch({
      type: USER_SIGNUP,
      payload: { userName, email, password, image: profileImage },
    });
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    setProfileImage(file ?? null);
  };

  useEffect(() => {
    if (redirect) {
      navigate("/posts");
      dispatch(setRedirect(false)); // Reset the redirect flag
    }
  }, [redirect, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <Formik
          initialValues={{
            userName: "",
            email: "",
            password: "",
            profileImage: null,
          }}
          validate={(values) => {
            const errors: {
              userName?: string;
              email?: string;
              password?: string;
            } = {};
            if (!values.userName) {
              errors.userName = "Username is required";
            }
            if (!values.email) {
              errors.email = "Email is required";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={handleSignup}
        >
          <Form className="mt-8 space-y-6">
            <div>
              <Field
                name="userName"
                type="text"
                autoComplete="userName"
                placeholder="Username"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="userName"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div>
              <Field
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-3"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div>
              <label className="block" htmlFor="profileImage">
                Upload your photo
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                onChange={handleProfileImageChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-3"
              />
              <ErrorMessage
                name="profileImage"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </Form>
        </Formik>
        {loading && (
          <div className="text-green-500 text-xs mt-1">Please wait...</div>
        )}
        {!loading && error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
        <div className="text-center">
          Already a user?{" "}
          <Link
            onClick={() => dispatch(setError(""))}
            to="/"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
