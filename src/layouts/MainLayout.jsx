import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden font-poppins">
      <Outlet />
    </div>
  );
};

export default MainLayout;
