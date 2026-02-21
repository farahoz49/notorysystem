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
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-black text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-yellow-600/30">

      {/* ===== BRAND ===== */}
      <h1 className="text-lg font-semibold tracking-wide text-white">
        ExpressNotory
      </h1>

      {/* ===== PROFILE DROPDOWN ===== */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl transition border border-white"
        >
          {/* Avatar Circle */}
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <span className="text-sm text-white">
            {user?.username}
          </span>

          <span className="text-white text-xs">▼</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-52 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-white overflow-hidden z-50 animate-fadeIn">

            <button
              onClick={() => {
                navigate("/change-password");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-yellow-600/10 transition flex items-center gap-2"
            >
              🔒 <span>Change Password</span>
            </button>

            <div className="border-t border-yellow-600/20" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-red-600/10 text-red-400 transition flex items-center gap-2"
            >
              🚪 <span>Logout</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;