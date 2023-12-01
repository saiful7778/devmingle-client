import { Link, NavLink, Outlet } from "react-router-dom";
import SiteLogo from "../components/SiteLogo";
import { sidebarLinks } from "../api/staticData";
import { Button } from "keep-react";
import { LuMenuSquare } from "react-icons/lu";
import { useState } from "react";

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const renderSidebarLinks = sidebarLinks?.map((sideNav) => (
    <li key={sideNav._id}>
      <NavLink
        className={({ isActive, isPending }) =>
          (isPending ? "animate-pulse" : isActive ? "bg-gray-200" : "") +
          " capitalize py-1 px-2 rounded-md hover:bg-gray-200 w-full block"
        }
        to={sideNav.path}
      >
        {sideNav.navName}
      </NavLink>
    </li>
  ));
  return (
    <div className="w-full min-h-screen overflow-x-hidden text-gray-700">
      <aside
        className={`fixed z-40 top-0 ${
          showSidebar ? "left-0" : "right-full"
        } h-screen p-4 w-40 bg-gray-300 border-r border-gray-400`}
      >
        <Link className="pl-2 inline-block mb-2" to="/">
          <SiteLogo />
        </Link>
        <ul className="flex flex-col gap-1">{renderSidebarLinks}</ul>
        <div className="absolute top-2 ml-2 left-full z-50">
          <Button
            className="active:focus:scale-95 duration-100"
            size="xs"
            type="primary"
            circle={true}
            onClick={() => setShowSidebar((l) => !l)}
          >
            <LuMenuSquare size={20} />
          </Button>
        </div>
      </aside>
      <main className={`${showSidebar ? "ml-40" : "ml-0"} mt-12 p-2 w-full`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
