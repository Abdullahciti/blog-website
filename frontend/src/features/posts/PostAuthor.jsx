/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";

const PostAuthor = ({ userId }) => {
  const users = useSelector(selectAllUsers);

  const author = users.find((user) => user.id == userId);

  return (
    <div className="flex justify-end items-center pr-6 my-4">
      <h1 className="font-light text-md">
        By {author ? author.name : "unknown Author"}
      </h1>
    </div>
  );
};

export default PostAuthor;
