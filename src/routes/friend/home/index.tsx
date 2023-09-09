import { memo, useEffect } from "react";
import Loading from "@/components/Loading";
import Manifest from "@/components/Manifest";
import usePreload from "@/hooks/usePreload";
import { NavLink, Outlet, useLocation, useMatch } from "react-router-dom";

function HomePage() {
  // preload basic data
  const { success } = usePreload();

  console.info("preload success", success);
  if (!success) {
    return <Loading reload={true} fullscreen={true} context="home-route" />;
  }
  const linkClass = `flex items-center gap-2.5 px-3 py-2 font-semibold text-sm text-gray-600 rounded-lg md:hover:bg-gray-800/10`;
  return (
    <div className="flex-center h-screen dark:bg-gray-700">
      <div className="relative py-8 px-10 shadow-md rounded-xl">friend.io</div>
      <div className="py-8 px-10 shadow-md rounded-xl">the marketplace for your friend</div>
      <div className="py-8 px-10 shadow-md rounded-xl">
        <NavLink className="bg-primary-400 md:hover:bg-primary-400" to={"/login"}>
          login
        </NavLink>
      </div>
    </div>
  );
}
export default memo(HomePage);
