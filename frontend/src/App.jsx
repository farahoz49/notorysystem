// src/App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./App/authSlice"; // path-kaaga sax ka dhig
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()); // ✅ refresh kadib user soo celi
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;