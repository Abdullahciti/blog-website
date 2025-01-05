import { useSelector } from "react-redux";
import { selectPostByUserId } from "../posts/postsSlice";
import { selectUserById } from "./userSlice";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
function UserPagee({ id: userId }) {
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const PostsByUserId = useSelector((state) =>
    selectPostByUserId(state, Number(userId))
  );

  if (
    !user || !PostsByUserId
  ) {
    return (
      <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
        <h3>Loading...</h3>
      </article>
    );
  } else if (user && PostsByUserId) {
    return (
      <div className="flex flex-col w-6/12 text-white font-semibold">
        {user && (
          <h1 className="text-black p-3 bg-white w-fit mb-10">{user.name}</h1>
        )}
        {PostsByUserId.map((post) => (
          <Link
            to={`/posts/${post._id}`}
            className="mx-auto my-1.5 hover:underline hover:text-textHover transition"
            key={post._id}
          >
            {post.title}
          </Link>
        ))}
      </div>
    );
  }
}

export default UserPagee;
