import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllUsers,
  getUsersStatus,
  getUsersError,
  fetchUsers,
} from "../users/userSlice";

import UserExerpt from "./UserExerpt";

const UserList = () => {
  const users = useSelector(selectAllUsers);
  const usersStatus = useSelector(getUsersStatus);
  const usersError = useSelector(getUsersError);

  const dispatch = useDispatch();

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  let renderedUsers;

  // render data
  if (usersStatus === "loading") {
    renderedUsers = <span className="font-light mt-4">Loading...</span>;
  } else if (usersStatus === "succeeded") {
    renderedUsers = users.map((user) => (
      <UserExerpt key={user.id} user={user} />
    ));
  } else if (usersStatus === "failed") {
    renderedUsers = <span className="font-light mt-4">{usersError}</span>;
  }

  return (
    <section className="flex flex-col min-w-96">
      <h2 className="text-white font-bold text-2xl">Users</h2>
      {renderedUsers}
    </section>
  );
};

export default UserList;
