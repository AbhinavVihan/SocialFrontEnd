import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { USER_LOGIN, setError, setRedirect } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/types";
import { selectError, selectLoading } from "../selectors/UserSelectors";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const redirect = useSelector((state: RootState) => state.users_all.redirect);
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (redirect) {
      navigate("/posts");
      dispatch(setRedirect(false)); // Reset the redirect flag
    }
  }, [redirect, navigate, dispatch]);

  const handleLogin = (values: any) => {
    const { userName, password } = values;
    dispatch({ type: USER_LOGIN, payload: { userName, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Formik
          initialValues={{ userName: "", password: "" }}
          validate={(values) => {
            const errors: { userName?: string; password?: string } = {};
            if (!values.userName) {
              errors.userName = "Username is required";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={handleLogin}
        >
          {({ isValid }) => (
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
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                <button
                  type="submit"
                  disabled={!isValid}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {loading && (
          <div className="text-green-500 text-xs mt-1">Please wait...</div>
        )}
        {!loading && error && (
          <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
        <div className="text-center">
          Not registered yet?{" "}
          <Link
            onClick={() => dispatch(setError(""))}
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
