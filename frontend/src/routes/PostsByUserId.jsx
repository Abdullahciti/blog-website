import { useParams } from "react-router-dom";
import UserPage from "../features/users/UserPage";

function PostsByUserId() {
  const { id } = useParams();

  return <UserPage id={id} />;
}

export default PostsByUserId;
