import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
