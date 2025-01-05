/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
const UserExerpt = ({ user }) => {
  return (
    <Link
      to={`/postsbyuserid/${user.id}`}
      className="border relative border-white rounded-lg text-white p-5 my-1.5"
    >
      {user.name}
    </Link>
  );
};

export default UserExerpt;
