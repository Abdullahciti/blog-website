/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/userSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});
