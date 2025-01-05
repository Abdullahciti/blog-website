import { NavLink } from "react-router-dom";
import { useContext } from "react";
import PostsContext from "../../context/PostsContext";

const MobileScreen = () => {
  const { isMenuOpen,  menuRef } = useContext(PostsContext);

  return (
    <ul
      ref={menuRef}
      className={`absolute top-full -right-full z-10 font-medium flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50 rtl:space-x-reverse dark:bg-gray-800 dark:border-gray-700 transition-all  ${
        isMenuOpen ? "right-0" : ""
      }`}
    >
      <li>
        <NavLink
          to={"/posts"}
          className={({ isActive }) =>
            isActive
              ? "block py-2 px-3 text-white bg-blue-700 rounded dark:text-white"
              : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          }
          aria-current="page"
        >
          Posts
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/users"}
          className={({ isActive }) =>
            isActive
              ? "block py-2 px-3 text-white bg-blue-700 rounded dark:text-white"
              : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          }
        >
          Users
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/addnewpost"}
          className={({ isActive }) =>
            isActive
              ? "block py-2 px-3 text-white bg-blue-700 rounded dark:text-white"
              : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          }
        >
          Add new post
        </NavLink>
      </li>
    </ul>
  );
};

export default MobileScreen;
