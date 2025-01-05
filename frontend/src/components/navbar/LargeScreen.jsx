import { NavLink } from "react-router-dom";

const LargeScreen = () => {
  return (
    <div id="navbar-default">
      <ul className="font-medium flex p-0 border border-gray-100 rounded-lg flex-row space-x-8 rtl:space-x-reverse mt-0 md:border-0 bg-white dark:bg-gray-900 dark:border-gray-700">
        <li>
          <NavLink
            to={"/posts"}
            className={({ isActive }) =>
              isActive
                ? "text-blue-700"
                : "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white"
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
                ? "text-blue-700"
                : "block py-2 px-3 text-gray-900 rounded hover:bg-transparent border-0 hover:text-blue-700 md:p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:bg-transparent"
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
                ? "text-blue-700"
                : "block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            }
          >
            Add new post
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default LargeScreen;
