import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/User.js"

dotenv.config();

 export const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.mongo_url);
    console.log("MongoDB connected");

    const email = "farahugaas0@gmail.com";
    const username = "superadmin";
    const phone = "771234684";
    const password = "super@123";

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      console.log("SUPER_ADMIN hore ayuu u jiraa");
      process.exit(0);
    }

    const superAdmin = await User.create({
      email: email.toLowerCase(),
      username,
      phone,
      password,
      role: "SUPER_ADMIN",
      status: "active",
    });

    console.log("SUPER_ADMIN successfully created");
    console.log({
      id: superAdmin._id,
      email: superAdmin.email,
      username: superAdmin.username,
      phone: superAdmin.phone,
      role: superAdmin.role,
      status: superAdmin.status,
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

