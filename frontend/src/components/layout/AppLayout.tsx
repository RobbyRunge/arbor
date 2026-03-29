import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main>
        <Outlet /> {/* ← hier erscheint die aktive Seite */}
      </main>
    </div>
  );
}

export default AppLayout;
