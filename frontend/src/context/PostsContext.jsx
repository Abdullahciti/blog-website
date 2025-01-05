/* eslint-disable react/prop-types */

import { createContext, useEffect, useRef, useState } from "react";
import UseWindowSize from "../hooks/UseWindowSize";

const PostsContext = createContext({});

export const PostsProvider = ({ children }) => {
  const { width } = UseWindowSize();

  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggelMenu = () => {
    setIsMenuOpen((prev) => !prev);
    console.log(isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <PostsContext.Provider
      value={{
        width,
        menuRef,
        isMenuOpen,
        toggelMenu,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
