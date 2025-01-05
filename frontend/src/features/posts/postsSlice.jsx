/* eslint-disable no-unused-vars */
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

const POSTS_URL = "https://blog-website-5nmr.onrender.com/api/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initailPost) => {
    const response = await axios.post(POSTS_URL, initailPost);
    return response.data;
  }
);

export const updatePostOrReaction = createAsyncThunk(
  "posts/updatePostOrReaction",
  async (updateData, { rejectWithValue }) => {
    try {
      const { id, ...updates } = updateData; // Extract `id` and the rest of the updates
      const response = await axios.patch(`${POSTS_URL}/dd${id}`, updates);
      return response.data; // Return the updated post
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  const response = await axios.delete(`${POSTS_URL}/${id}`);
  if (response?.status === 200) return id;
  return `${response?.status}: ${response?.statusText}`;
});

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle", // "idle" || "loading" || "succeeded" || "failed"
    error: null,
    count: 0,
  },
  reducers: {
    increaseCount(state, action) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 100,
          wow: 100,
          heart: 30,
          rocket: 10,
          coffee: 20,
        };
        state.posts.push(action.payload);
      })
      .addCase(updatePostOrReaction.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const existingPost = state.posts.find(
          (post) => post._id === updatedPost._id
        );

        if (existingPost) {
          // Replace the old post with the updated one
          Object.assign(existingPost, updatedPost);
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload) {
          console.log("Delete could not complete");
          console.log("chceck action.payload", action.payload);
          return;
        }
        const id = action.payload;
        const posts = state.posts.filter((post) => post._id !== id);
        state.posts = posts;
      })
      .addCase(deletePost.rejected, (state, action) => {
        console.log(`post cannot be deleted duo to ${action.payload}`);
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const { increaseCount } = postsSlice.actions;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post._id === postId);

export const selectPostByUserId = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => {
    return posts.filter((post) => post.userId === userId);
  }
);

export default postsSlice.reducer;
