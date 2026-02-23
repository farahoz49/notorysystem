import express from "express";
import {
  approveUser,
  changePassword,
  forgotPassword,
  getAllUsers,
  getMe,
  getSingleUser,
  inactiveUser,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updateUser,
} from "../controller/UserController.js";
import { authenticate, authorizeRoles } from "../middleware/authmiddleware.js";

const userRouter = express.Router();

userRouter.post("/registerUser", authenticate, authorizeRoles("ADMIN"), registerUser);
userRouter.post("/login", loginUser);

// ✅ auth helpers
userRouter.get("/me", authenticate, getMe);

// ✅ password routes (MUST be before "/:id")
userRouter.put("/change-password", authenticate, changePassword);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.post("/logout", authenticate, logout);

// ✅ lists
userRouter.get("/", authenticate, getAllUsers);

// ✅ admin actions
userRouter.put("/approve/:id", authenticate, authorizeRoles("ADMIN"), approveUser);
userRouter.put("/inactive/:id", authenticate, authorizeRoles("ADMIN"), inactiveUser);

// ✅ dynamic routes LAST
userRouter.get("/:id", authenticate, getSingleUser);
userRouter.put("/:id", updateUser);

export default userRouter;