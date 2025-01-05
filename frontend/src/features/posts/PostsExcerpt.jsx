/* eslint-disable react/prop-types */
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";

const PostsExcerpt = ({ post }) => {
  return (
    <article
      key={post._id}
      className="border relative border-white rounded-lg text-white p-5 my-1.5"
    >
      <div className="flex w-full justify-end items-center my-2">
        <TimeAgo timestamp={post.date} />
      </div>
      <h1 className="font-semibold">{post.title}</h1>
      <h3 className="">{post.content.substring(0, 10)}...</h3>
      <PostAuthor userId={post.userId} />
      <ReactionButtons post={post} />
      <div className="flex items-center justify-between px-6">
        <Link
          to={`/posts/editpost/${post._id}`}
          className="underline font-semibold text-md hover:text-yellow-300 transition"
        >
          Edit Post
        </Link>
        <Link
          to={`/posts/${post._id}`}
          className="underline font-semibold text-md hover:text-textHover transition"
        >
          Visit
        </Link>
      </div>
    </article>
  );
};

export default PostsExcerpt;
