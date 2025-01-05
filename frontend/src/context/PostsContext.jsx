/* eslint-disable react/prop-types */

import { createContext } from "react";
import UseWindowSize from "../hooks/UseWindowSize";

const PostsContext = createContext({});

export const PostsProvider = ({ children }) => {
  const { width } = UseWindowSize();

  return (
    <PostsContext.Provider
      value={{
        width,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
