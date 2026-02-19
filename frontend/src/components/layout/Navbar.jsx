// src/components/layout/Navbar.jsx
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../App/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-lg font-semibold tracking-wide">
       Notory Public
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">
          {user?.username}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;