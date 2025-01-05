import { NavLink } from "react-router-dom";
import UseWindowSize from "./hooks/UseWindowSize";
import MobileScreen from "./components/navbar/MobileScreen";
import LargeScreen from "./components/navbar/LargeScreen";
import { getCount, increaseCount } from "./features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import PostsContext from "./context/PostsContext";

const Navbar = () => {
  const { width } = UseWindowSize();

  const { setIsMenuOpen, isMenuOpen, menuRef } = useContext(PostsContext);

  const counter = useSelector(getCount);
  const dispatch = useDispatch();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          href="#"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://redux-toolkit.js.org/img/redux.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Blog Website with redux
          </span>
          <button
            onClick={() => dispatch(increaseCount())}
            className={`${
              width < 950
                ? "hidden"
                : "text-white text-2xl flex items-center gap-3"
            }`}
          >
            <span className="text-light text-sm">test the preformance</span>
            {counter}
          </button>
        </NavLink>
        <button
          ref={menuRef}
          type="button"
          className={
            width >= 767
              ? "hidden"
              : `inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700  ${
                  isMenuOpen
                    ? "outline-none ring-2 ring-gray-400 dark:ring-gray-600"
                    : ""
                }`
          }
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            console.log(isMenuOpen);
          }}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        {width <= 767 ? (
          <div className="relative w-full">
            <MobileScreen />
          </div>
        ) : (
          <LargeScreen />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
