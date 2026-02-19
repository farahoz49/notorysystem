// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const baseLink =
  "group flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 min-h-screen bg-black text-white border-r border-white/10 p-4">
      <nav className="space-y-1">
        {user?.role === "ADMIN" && (
          <>
            <NavItem to="/admin-dashboard" label="Dashboard" />
            <NavItem to="/admin/Reception" label="Reception" />
            <NavItem to="/admin/ViewAgreements" label="View Agreements" />
            <NavItem to="/admin/users" label="Users" />
            <NavItem to="/admin/reports" label="Reports" />
          </>
        )}

        {user?.role === "USER" && (
          <>
            <NavItem to="/user-dashboard" label="Dashboard" />
            <NavItem to="/user/reception" label="Reception" />
            <NavItem to="/user/viewAgreements" label="View Agreements" />
            <NavItem to="/user/reports" label="Reports" />
          </>
        )}
      </nav>
    </aside>
  );
};

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          baseLink,
          isActive
            ? "bg-white/20 text-white border border-white/20"
            : "text-white/80 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white" />
      {label}
    </NavLink>
  );
};

export default Sidebar;
