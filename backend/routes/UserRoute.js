import express from "express";
import {
  approveUser,
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

userRouter.post("/registerUser", authenticate , authorizeRoles("ADMIN"), registerUser);
userRouter.post("/login", loginUser);

// ✅ GET current logged-in user (MUST be before "/:id")
userRouter.get("/me", authenticate, getMe);

userRouter.get("/", authenticate, getAllUsers);

userRouter.get("/:id", authenticate, getSingleUser);

// ✅ Admin only - approve user
userRouter.put("/approve/:id", authenticate, authorizeRoles("ADMIN"), approveUser);
userRouter.put("/inactive/:id", authenticate, authorizeRoles("ADMIN"), inactiveUser);

userRouter.put("/:id", authenticate, updateUser);

userRouter.post("/logout", authenticate, logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;