import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePostOrReaction, deletePost } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/userSlice";

const EditPostForm = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state) => selectPostById(state, postId));

  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [requestStatus, setRequestStatus] = useState("idle");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setUserId(post.userId);
    }
  }, [post]);

  const dispatch = useDispatch();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(
          updatePostOrReaction({
            id: post._id,
            title,
            content,
            userId,
            date: new Date(),
            reactions: post.reactions,
          })
        );
        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/posts/${postId}`);
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost(postId));
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setRequestStatus("idle");
    }
  };

  if (!post) {
    return (
      <article className="border relative border-white rounded-lg text-white p-5 my-1.5">
        <h3>Loading...</h3>
      </article>
    );
  }
  return (
    <section className="flex flex-col w-full">
      <h2 className="mx-auto text-white font-semibold text-xl">Edit Post</h2>
      <form className="grid grid-cols-2 gap-y-8 gap-x-3 pt-6 w-full">
        <div className="cols-span-1 flex flex-col w-8/12 ml-auto gap-1.5">
          <label className="text-white font-semibold" htmlFor="postTitle">
            Post Title:
          </label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            className=" outline-none rounded-sm p-2"
            value={title}
            onChange={onTitleChanged}
          />
        </div>
        <div className="col-span-1 flex flex-col w-8/12 mr-auto gap-1.5">
          <label
            className="text-white font-semibold outline-none rounded-sm"
            htmlFor="postAuthor"
          >
            Author:
          </label>
          <select
            id="postAuthor"
            className="outline-none rounded-sm p-2"
            value={userId}
            onChange={onAuthorChanged}
          >
            {usersOptions}
          </select>
        </div>
        <div className="col-span-2 flex flex-col w-8/12 mx-auto gap-1.5">
          <label className="text-white font-semibold" htmlFor="postContent">
            Content:
          </label>
          <textarea
            id="postContent"
            name="postContent"
            className="resize-none outline-none rounded-sm p-2 w-full min-h-32"
            value={content}
            onChange={onContentChanged}
          />
        </div>
        <div className="col-span-2 flex justify-end w-8/12 mx-auto">
          <button
            className={`mx-1.5 rounded-lg bg-altTextColor p-3 font-semibold ${
              !canSave
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer bg-[#777575] hover:bg-[#696769] text-white"
            } transition`}
            type="button"
            onClick={onSavePostClicked}
          >
            Save Post
          </button>
          <button
            className="mx-1.5 rounded-lg bg-red-500 p-3 text-white font-semibold hover:bg-red-600 transition"
            type="button"
            onClick={onDeletePostClicked}
          >
            Delete Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPostForm;
