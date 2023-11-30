import { NavLink, Link } from "react-router-dom";
import SiteLogo from "../../components/SiteLogo";
import { IoNotifications, IoCloseCircleOutline } from "react-icons/io5";
import { Button } from "keep-react";
import { LuMenuSquare } from "react-icons/lu";
import { useState } from "react";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navLinks = (
    <>
      <li>
        <NavLink
          className={({ isActive, isPending }) =>
            (isPending ? "animate-pulse" : isActive ? "active" : "") +
            " nav-link"
          }
          to="/"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive, isPending }) =>
            (isPending ? "animate-pulse" : isActive ? "active" : "") +
            " nav-link"
          }
          to="/membership"
        >
          Membership
        </NavLink>
      </li>
    </>
  );
  return (
    <>
      <nav className="flex items-center justify-between gap-2 py-2">
        <div className="flex gap-2 items-center">
          <Button
            className="active:focus:scale-95 duration-100 md:hidden"
            size="xs"
            type="primary"
            circle={true}
            onClick={() => setShowMobileMenu((l) => !l)}
          >
            <LuMenuSquare size={20} />
          </Button>
          <Link to="/">
            <SiteLogo />
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <ul className="hidden md:flex gap-2">{navLinks}</ul>
          <button className="relative">
            <IoNotifications size="30" />
            <div className="bg-amber-500 absolute rounded-3xl flex items-center justify-center w-[30px] h-[15px] -top-px -right-3 text-body-6">
              0
            </div>
          </button>
          <UserLogout />
        </div>
      </nav>
      <div
        className={`fixed z-[1000] top-0 ${
          showMobileMenu ? "left-0" : "-left-full"
        } min-h-screen p-4 shadow-md bg-white text-center duration-300 md:hidden`}
      >
        <Button
          className="active:focus:scale-95 duration-100 mx-auto mb-6"
          size="xs"
          type="primary"
          circle={true}
          onClick={() => setShowMobileMenu((l) => !l)}
        >
          <IoCloseCircleOutline size={20} />
        </Button>
        <ul className="space-y-3">{navLinks}</ul>
      </div>
    </>
  );
};

const UserLogout = () => {
  return (
    <Button href="/register" className="ml-2 p-0 btn" size="xs" type="primary">
      Join us
    </Button>
  );
};

export default Navbar;
