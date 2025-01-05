/* eslint-disable react/prop-types */
import PostAuthor from "../../features/posts/PostAuthor";
import TimeAgo from "../../features/posts/TimeAgo";
import ReactionButtons from "../../features/posts/ReactionButtons";
import { Link } from "react-router-dom";
import { selectPostById } from "../../features/posts/postsSlice";
import { useSelector } from "react-redux";

const PostExcerptById = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
        <h3>Loading...</h3>
      </article>
    );
  }

  return (
    <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
      <h3 className="font-semibold">{post.title}</h3>
      <h3 className="">{post.content}</h3>
      <div className="flex justify-between w-full mt-4">
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </div>
      <ReactionButtons post={post} />
      <div className="flex items-center justify-between px-6">
        <Link
          to={`/posts/editpost/${post._id}`}
          className="underline font-semibold text-md bg-yellow-600 transition hover:bg-yellow-700 text-white px-3 py-1.5 rounded-sm"
        >
          Edit Post
        </Link>
      </div>
    </article>
  );
};

export default PostExcerptById;
