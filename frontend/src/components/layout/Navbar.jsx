// // src/components/layout/Navbar.jsx
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../../App/authSlice";
// import expressNotoryLogo from "../../assets/expressNotoryLogo.png";
// const Navbar = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//   };

//   return (
//    <header className="bg-black text-white px-6 py-3 flex justify-between items-center shadow">

//   {/* ✅ LEFT: LOGO + NAME */}
//   <div className="flex items-center gap-3">
//     <img
//       src={expressNotoryLogo}
//       alt="ExpressNotory"
//       className="h-14 w-auto object-contain"
//     />
//     <span className="text-lg font-semibold tracking-wide">
//       ExpressNotory
//     </span>
//   </div>

//   {/* RIGHT SIDE */}
//   <div className="flex items-center gap-4">
//     <span className="text-sm text-slate-300">
//       {user?.username}
//     </span>

//     <button
//       onClick={handleLogout}
//       className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium transition"
//     >
//       Logout
//     </button>
//   </div>

// </header>
//   );
// };

// export default Navbar;
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../App/authSlice";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => dispatch(logoutUser());

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ image url (ka dooro field-ka aad backend-ka ku haysato)
  const avatarUrl = user?.avatarUrl || user?.photo || "";
  const fullName = user?.fullName || user?.name || user?.username || "User";
  const role = user?.role || "User";

  return (
    <header className="bg-black text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-white/10">
      {/* BRAND */}
      <h1 className="text-lg font-semibold tracking-wide">Notory System</h1>

      {/* PROFILE */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl transition border border-white/10"
        >
          {/* Small Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
              {String(user?.username || "U").charAt(0).toUpperCase()}
            </div>
          )}

          <span className="text-sm">{user?.username || "username"}</span>
          <span className="text-white/70 text-xs">▾</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-[340px] bg-white text-black rounded-md shadow-2xl border border-black/10 overflow-hidden z-50">
            {/* Top profile card (sida sawirka) */}
            <div className="bg-gray-100 px-4 py-3 border-b border-black/10">
              <div className="text-sm font-medium text-gray-700">Akoon kayga</div>
            </div>

            <div className="p-4 flex items-center gap-4">
              {/* Big Avatar */}
              <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-black/10">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-700">
                    {String(fullName).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {fullName}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {role}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  @{user?.username}
                </div>
              </div>
            </div>

            <div className="border-t border-black/10" />

            {/* Actions */}
            <button
              onClick={() => {
                navigate("/change-password");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition flex items-center gap-2"
            >
              🔒 <span>Badal password ka</span>
            </button>

            <div className="border-t border-black/10" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 transition flex items-center gap-2"
            >
              🚪 <span>Ka bax</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;