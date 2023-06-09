import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_POST } from "../sagas/postSaga";
import { selectAllUsers, selectCurrentUser } from "../selectors/UserSelectors";
import Select from "react-select";
import { FETCH_USERS } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
});

const CreatePostPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    { label: string; value: string }[]
  >([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: FETCH_USERS });
  }, [dispatch]);

  const users = useSelector(selectAllUsers);
  const currentUser = useSelector(selectCurrentUser);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    setSelectedImage(file ?? null);
  };

  const handleSubmit = (values: any) => {
    const { title, content } = values;
    dispatch({
      type: CREATE_POST,
      payload: { title, content, image: selectedImage, selectedTags },
    });
  };

  const handleTagChange = (selectedOptions: any) => {
    setSelectedTags(selectedOptions);
  };

  const tagOptions = users
    .filter((u) => u._id !== currentUser?._id)
    .map((u) => {
      return { value: u._id, label: u.userName };
    });

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-gray-100">
      <button
        className="text-blue-500 top-4 left-4 pl-5 pt-5 hover:text-blue-700 mb-4"
        onClick={handleGoBack}
      >
        Back
      </button>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a Post
          </h2>
          <Formik
            initialValues={{ title: "", content: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <Field
                    name="title"
                    type="text"
                    placeholder="Title"
                    className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2 mt-2"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500"
                  />
                </div>
                <div>
                  <Field
                    name="content"
                    as="textarea"
                    placeholder="Content"
                    className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm p-2 mt-2"
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="error-message text-red-500"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div>
                    <label htmlFor="tags-input">Enter tags:</label>
                    <Select
                      id="tags-input"
                      name="tags"
                      placeholder="Enter tags separated by commas"
                      isMulti={true}
                      options={tagOptions}
                      value={selectedTags}
                      onChange={handleTagChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Create Post
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
