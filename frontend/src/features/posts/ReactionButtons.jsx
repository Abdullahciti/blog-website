/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { updatePostOrReaction } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={emoji}
        type="button"
        className="mx-1.5 text-xl"
        onClick={() => {
          dispatch(updatePostOrReaction({ id: post._id, reaction: name }));
        }}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });
  return <div className="my-6 mx-auto w-fit">{reactionButtons}</div>;
};

export default ReactionButtons;
