/* eslint-disable react/prop-types */

import { createContext, useState, useEffect, useRef } from "react";

import useAxiosFetch from "../hooks/useAxiosFetch";
import UseWindowSize from "../hooks/UseWindowSize";

const PostsContext = createContext({});

export const PostsProvider = ({ children }) => {
  const { width } = UseWindowSize();
  const baseUrl = `http://localhost:3000/api`;
  const confirmRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchedItems, setSearchedItems] = useState([]);
  const [editData, setEditData] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const {
    data: posts = [],
    isLoading,
    fetchError,
    refetch,
  } = useAxiosFetch(`${baseUrl}/posts`);

  useEffect(() => {
    if (!posts) return;

    const normalize = (str) => str.toLowerCase().replaceAll(" ", "");

    const filteredItems = searchValue
      ? posts.filter(
          (item) =>
            normalize(item.name).includes(normalize(searchValue)) ||
            normalize(item.email).includes(normalize(searchValue))
        )
      : posts;

    setSearchedItems(filteredItems);
  }, [searchValue, posts]);

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  }, [showPopup]);

  return (
    <PostsContext.Provider
      value={{
        baseUrl,
        width,
        confirmRef,
        searchValue,
        setSearchValue,
        showPopup,
        setShowPopup,
        popupText,
        setPopupText,
        searchedItems,
        setSearchedItems,
        editData,
        setEditData,
        confirmation,
        setConfirmation,
        isLoading,
        fetchError,
        posts,
        refetch,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
