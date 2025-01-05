import { useParams } from "react-router-dom";
import PostExcerptById from "./PostExcerptById";

const SingelPost = () => {
  const { id: postId } = useParams();

  return (
    <div>
      <PostExcerptById postId={postId} />
    </div>
  );
};

export default SingelPost;
