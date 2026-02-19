import { useDispatch, useSelector } from "react-redux";
import { login, logoutUser, loadUser } from "../App/authSlice.jsx";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  /**
   * Login and redirect by role
   */
  const handleLogin = async (data) => {
    const res = await dispatch(login(data));

    if (res.meta.requestStatus === "fulfilled") {
      const role = res.payload.role;

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "USER":
          navigate("/user");
          break;
       
        default:
          navigate("/login");
      }
    }
  };

  /**
   * Logout
   */
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  /**
   * Load user (refresh safe)
   */
  const handleLoadUser = () => {
    dispatch(loadUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    loadUser: handleLoadUser,
  };
};

export default useAuth;