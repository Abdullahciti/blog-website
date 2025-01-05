import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const Root = () => {
  return (
    <div className="bg-slate-900 min-h-screen w-full">
      <Navbar />
      <div className="bg-yellow-900 p-6 flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
