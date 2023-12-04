import { Link, NavLink, Outlet } from "react-router-dom";
import SiteLogo from "../components/SiteLogo";
import { sidebarLinks } from "../api/staticData";
import { Button } from "keep-react";
import { LuMenuSquare } from "react-icons/lu";
import { useState } from "react";
import PropTypes from "prop-types";
import useAdmin from "../hooks/useAdmin";

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAdmin] = useAdmin();
  const renderSidebarLinks = sidebarLinks?.map((sideNav) => {
    if (!sideNav?.adminRoute) {
      return <SidebarItem key={sideNav._id} inputData={sideNav} />;
    } else if (isAdmin) {
      return <SidebarItem key={sideNav._id} inputData={sideNav} />;
    }
  });
  return (
    <div className="w-full min-h-screen overflow-x-hidden text-gray-700">
      <aside
        className={`fixed z-40 top-0 ${
          showSidebar ? "left-0" : "right-full"
        } h-screen p-4 w-40 bg-gray-200 border-r border-gray-300`}
      >
        <Link className="pl-2 inline-block mb-2" to="/">
          <SiteLogo />
        </Link>
        <ul className="flex flex-col gap-1">{renderSidebarLinks}</ul>
        <div className="absolute top-0 pl-2 left-full z-50 w-screen p-2 border border-gray-300 bg-white">
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
      <main
        className={`${
          showSidebar ? "ml-40" : "ml-0"
        } p-2 mt-14 overflow-auto bg-gray-100`}
      >
        <Outlet />
      </main>
    </div>
  );
};

const SidebarItem = ({ inputData }) => {
  return (
    <li>
      <NavLink
        className={({ isActive, isPending }) =>
          (isPending ? "animate-pulse" : isActive ? "bg-gray-100" : "") +
          " capitalize py-1 px-2 rounded-md hover:bg-gray-100 w-full block border border-gray-300"
        }
        to={inputData.path}
      >
        {inputData.navName}
      </NavLink>
    </li>
  );
};

SidebarItem.propTypes = {
  inputData: PropTypes.object,
};

export default DashboardLayout;
