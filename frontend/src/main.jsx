import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast"; // ✅ ku dar

import "./index.css";
import App from "./App.jsx";
import store from "./App/store.jsx";
import AppInitializer from "./AppInitializer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <App />

        {/* ✅ Toast Global */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b",
              color: "#fff",
            },
          }}
        />

      </AppInitializer>
    </Provider>
  </StrictMode>
);