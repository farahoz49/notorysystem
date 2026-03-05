// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import expressNotoryLogo from "../../assets/expressNotoryLogo.png";

const linkBase =
  "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
const { data: settings } = useSelector((state) => state.settings);
const officeName = settings?.office?.name ;
  return (
    <aside className="w-64 min-h-screen bg-black text-white border-r border-white/10 flex flex-col">

      {/* ===== Brand / Logo ===== */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            <img
              src={expressNotoryLogo}
              alt="ExpressNotory"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold">{officeName}</p>
            <p className="text-[11px] text-white/60">
              {/* Magaca isticmalaha {user?.username } */}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Menu ===== */}
      <nav className="flex-1 p-4 space-y-2">

        <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-widest text-white/40">
          Menu
        </p>

        {user?.role === "ADMIN" && (
          <>
            <NavItem to="/admin-dashboard" label="Dashboard" />
            <NavItem to="/admin/reception" label="Reception" />
            <NavItem to="/admin/ViewAgreements" label=" Aatada" />
            <NavItem to="/admin/users" label="Users" />
            <NavItem to="/admin/reports" label="Reports" />
            {/* <NavItem to="/admin/documents" label="Documents" /> */}
            {/* <NavItem to="/admin/notoryList" label="Notory List" /> */}
            
            <NavItem to="/admin/settings" label="Settings" />

          </>
        )}
        

        {user?.role === "USER" && (
          <>
            <NavItem to="/user-dashboard" label="Dashboard" />
            <NavItem to="/user/reception" label="Reception" />
            <NavItem to="/user/viewAgreements" label="Aatada" />
            <NavItem to="/user/reports" label="Reports" />
          </>
        )}
      </nav>

      {/* ===== Footer ===== */}
      <div className="p-4 border-t border-white/10">
        <p className="text-[11px] text-white/50">
          Logged in as{" "}
          <span className="text-white/80 font-medium">
            {user?.username}
          </span>
        </p>
      </div>
    </aside>
  );
};

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          linkBase,
          isActive
            ? "bg-white/10 text-white ring-1 ring-white/15"
            : "text-white/70 hover:text-white hover:bg-white/5",
        ].join(" ")
      }
    >
      {/* Active indicator */}
      <span
        className={[
          "absolute left-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-white transition-opacity",
        ].join(" ")}
        style={{ opacity: 0 }}
      />

      {/* Dot */}
      <span className="h-2 w-2 rounded-full bg-white/30 group-hover:bg-white/60 transition" />

      <span className="flex-1">{label}</span>

      {/* Arrow */}
      <span className="text-white/30 group-hover:text-white/60 transition">
        →
      </span>

      <style>
        {`
        a[aria-current="page"] span[style] { opacity: 1 !important; }
        `}
      </style>
    </NavLink>
  );
};

export default Sidebar;