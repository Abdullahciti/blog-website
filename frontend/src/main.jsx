import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Routing
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Store \ Redux
import store from "./app/store.jsx";
import { Provider } from "react-redux";

import "./index.css";
// Components & Routes
import Home from "./routes/Posts.jsx";
import ErrPage from "./routes/ErrPage.jsx";
import Layout from "./routes/Layout.jsx";
import Index from "./routes/Index.jsx";
import Users from "./routes/Users.jsx";
import AddPost from "./routes/AddPost.jsx";
import SingelPost from "./routes/posts/SingelPost.jsx";
import EditPost from "./routes/posts/EditPost.jsx";
import PostsByUserId from "./routes/PostsByUserId.jsx";

// Context
import { PostsProvider } from "./context/PostsContext.jsx";

// Fetching Data from api
import { fetchUsers } from "./features/users/userSlice.jsx";
import { fetchPosts } from "./features/posts/postsSlice.jsx";
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrPage />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/posts",
        element: <Home />,
      },
      { path: "/posts/:id", element: <SingelPost /> },
      { path: "/posts/editpost/:id", element: <EditPost /> },
      { path: "/postsbyuserid/:id", element: <PostsByUserId /> },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/addnewpost",
        element: <AddPost />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PostsProvider>
        <RouterProvider router={router}>
          <Layout />
        </RouterProvider>
      </PostsProvider>
    </Provider>
  </StrictMode>
);
