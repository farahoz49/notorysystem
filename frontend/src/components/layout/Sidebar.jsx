

// // src/components/layout/Sidebar.jsx
// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";

// // ✅ optional: haddii aad rabto logo dusha
// import expressNotoryLogo from "../../assets/expressNotoryLogo.png";

// const linkBase =
//   "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/30";

// const Sidebar = () => {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <aside className="w-64 min-h-screen bg-black text-white border-r border-white/10">
//       {/* ✅ Top Brand */}
//       <div className="p-4 border-b border-white/10">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
//             <img
//               src={expressNotoryLogo}
//               alt="ExpressNotory"
//               className="h-8 w-auto object-contain"
//             />
//           </div>

//           <div className="leading-tight">
//             <p className="text-sm font-semibold">ExpressNotory</p>
//             <p className="text-[11px] text-white/60">
//               {user?.role === "ADMIN" ? "Admin Panel" : "User Panel"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Menu */}
//       <nav className="p-3 space-y-2">
//         <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-widest text-white/40">
//           Menu
//         </p>

//         {user?.role === "ADMIN" && (
//           <>
//             <NavItem to="/admin-dashboard" label="Dashboard" />
//             <NavItem to="/admin/Reception" label="Reception" />
//             <NavItem to="/admin/ViewAgreements" label="View Agreements" />
//             <NavItem to="/admin/users" label="Users" />
//             <NavItem to="/admin/reports" label="Reports" />
//           </>
//         )}

//         {user?.role === "USER" && (
//           <>
//             <NavItem to="/user-dashboard" label="Dashboard" />
//             <NavItem to="/user/reception" label="Reception" />
//             <NavItem to="/user/viewAgreements" label="View Agreements" />
//             <NavItem to="/user/reports" label="Reports" />
//           </>
//         )}
//       </nav>

//       {/* ✅ Bottom small footer */}
//       <div className="mt-auto p-4 border-t border-white/10">
//         <p className="text-[11px] text-white/50">
//           Logged in as:{" "}
//           <span className="text-white/80 font-medium">{user?.username}</span>
//         </p>
//       </div>
//     </aside>
//   );
// };

// const NavItem = ({ to, label }) => {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         [
//           linkBase,
//           isActive
//             ? "bg-white/10 text-white ring-1 ring-white/15"
//             : "text-white/70 hover:text-white hover:bg-white/5",
//         ].join(" ")
//       }
//     >
//       {/* ✅ Active indicator bar */}
//       <span
//         className={[
//           "absolute left-2 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full transition-opacity",
//           "bg-white",
//         ].join(" ")}
//         style={{ opacity: 0 }}
//       />

//       {/* ✅ Dot icon */}
//       <span className="h-2 w-2 rounded-full bg-white/30 group-hover:bg-white/60 transition" />

//       <span className="flex-1">{label}</span>

//       {/* ✅ subtle arrow on hover */}
//       <span className="text-white/30 group-hover:text-white/60 transition">
//         →
//       </span>

//       {/* show indicator only when active (pure CSS via aria-current) */}
//       <style>
//         {`
//           a[aria-current="page"] span[style] { opacity: 1 !important; }
//         `}
//       </style>
//     </NavLink>
//   );
// };

// export default Sidebar;
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
            <NavItem to="/admin/settings" label="Settings" />
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

