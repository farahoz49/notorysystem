// src/layouts/MainLayout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col">
      {/* Navbar fixed */}
      <Navbar />

      {/* Body area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixed */}
        <Sidebar />

        {/* Main content scroll only */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
