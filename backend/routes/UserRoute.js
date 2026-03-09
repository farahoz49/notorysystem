import express from "express";
import {
  approveUser,
  changePassword,
  deleteUser,
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

userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// auth helpers
userRouter.get("/me", authenticate, getMe);
userRouter.post("/logout", authenticate, logout);
userRouter.put("/change-password", authenticate, changePassword);

// users management
userRouter.post(
  "/registerUser",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  registerUser
);

userRouter.get(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  getAllUsers
);

userRouter.put(
  "/approve/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  approveUser
);

userRouter.put(
  "/inactive/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  inactiveUser
);

// dynamic routes last
userRouter.get(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  getSingleUser
);

userRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  updateUser
);

userRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  deleteUser
);

export default userRouter;