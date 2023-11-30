import { Outlet } from "react-router-dom";
import Navbar from "./shared/Navbar";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden text-gray-700 bg-gray-100 font-poppins">
      <div className="container w-full md:w-4/5 mx-auto p-2">
        <header>
          <Navbar />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
