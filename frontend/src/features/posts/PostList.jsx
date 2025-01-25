import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from "./postsSlice";

import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";

const PostList = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  let renderedPosts;

  if (postsStatus === "loading") {
    renderedPosts = (
      <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
        <h3>Loading...</h3>
      </article>
    );
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    renderedPosts = orderedPosts.map((post) => (
      <PostsExcerpt key={post._id} post={post} />
    ));
  } else if (postsStatus === "failed") {
    renderedPosts = (
      <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
        <h3>Error fetching data: {postsError}</h3>
      </article>
    );
  }

  return (
    <section className="flex flex-col min-w-96 lg:w-4/6 mx-auto w-5/6">
      <h2 className="text-white font-bold text-2xl">Posts</h2>
      {renderedPosts}
    </section>
  );
};

export default PostList;
