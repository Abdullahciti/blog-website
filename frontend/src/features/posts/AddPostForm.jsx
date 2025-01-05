// redirect user
import { useNavigate } from "react-router-dom";
// Gloobal react
import { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";
// actions
import { addNewPost } from "./postsSlice";

const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const initailPost = {
    title,
    content,
    userId,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = (e) => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost(initailPost));
        navigate("/posts");
      } catch (err) {
        console.log(err);
      } finally {
        setAddRequestStatus("idle");
      }
    } else {
      e.preventDefault();
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <form className="flex flex-col w-full justify-center items-center gap-6">
      <div className="md:w-7/12 min-w-96 flex flex-col">
        <label className="mb-3 text-white text-xl" htmlFor="title">
          Enter your title
        </label>
        <input
          className="outline-none py-3 px-3"
          type="text"
          id="title"
          aria-label="title"
          aria-placeholder="title"
          onChange={onTitleChanged}
          value={title}
        />
      </div>
      <div className="md:w-7/12 min-w-96 flex flex-col">
        <label className="mb-3 text-white text-xl" htmlFor="author">
          Enter your Id
        </label>
        <select
          className="outline-none py-3 px-3"
          aria-label="author"
          id="author"
          aria-placeholder="User Id"
          value={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>
      </div>
      <div className="md:w-7/12 min-w-96 flex flex-col">
        <label className="mb-3 text-white text-xl" htmlFor="content">
          Enter your content
        </label>
        <textarea
          className="outline-none py-3 px-3 w-full resize-none min-w-full min-h-64"
          type="text"
          id="content"
          aria-label="content"
          aria-placeholder="content"
          onChange={onContentChanged}
          value={content}
        />
      </div>
      <div
        className={`min-w-24 flex flex-col px-6 py-2 text-white text-2xl disabled:bg-black ${
          canSave ? "bg-mainButtonColor" : "bg-altBgColor"
        }`}
      >
        <button
          onClick={onSavePostClicked}
          type="button"
          className=""
          aria-label="submit"
          disabled={!canSave}
        >
          Save Post
        </button>
      </div>
    </form>
  );
};

export default AddPostForm;
