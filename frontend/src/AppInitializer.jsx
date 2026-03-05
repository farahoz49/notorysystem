import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./App/authSlice";
import { loadSettings } from "./App/settingsSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()); // 👈 refresh fix
     dispatch(loadSettings()); // ✅ settings hal mar soo qaado
  }, [dispatch]);

  return children;
};

export default AppInitializer;