import { jwt_secret } from "../config/config.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


/**  REGISTER  **/
export const registerUser = async (req, res) => {
  try {
    const { email, username, password, phone, status, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
       
        { phone: phone}

      ],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email ka ama Nambarka mid ayaa hore loo diwan galiyay" });
    }

    const userInfo = new User({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      phone,
      status, // active or inactive
      // role optional: default = 'user' haddii aan la dirin
      ...(role && { role }),
    });

    await userInfo.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registering user:", error);
    res.status(500).json({ message: "Error in registering user" });
  }
};

// /**  LOGIN  **/
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).select("+password");
    if (!user) return res.status(400).json({ message: "phone does not exist" });

    if (user.status !== "active") {
      return res.status(403).json({ message: "Akoon kan Active maaha" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      jwt_secret,
      { expiresIn: "7d" }
    );

    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge,
    });

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("Error in logging in user:", error);
    res.status(500).json({ message: "Error in logging in user" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {

    let filter = {};

    // haddii ADMIN yahay ha arkin SUPER_ADMIN
    if (req.user.role === "ADMIN") {
      filter = { role: { $ne: "SUPER_ADMIN" } };
    }

    const users = await User.find(filter).select("-password");

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};
export const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ADMIN ma delete gareyn karo SUPER_ADMIN
    if (req.user.role === "ADMIN" && user.role === "SUPER_ADMIN") {
      return res.status(403).json({
        message: "You cannot delete SUPER_ADMIN"
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// // new login function

// export const loginUser = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     const user = await User.findOne({ phone }).select("+password");
//     if (!user) {
//       return res.status(400).json({ message: "Phone does not exist" });
//     }

//     
//     const isPasswordCorrect = await user.comparePassword(password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const expirein = 7 * 24 * 60 * 60; // 7 days (in seconds)
//     const token = jwt.sign({ _id: user._id, role: user.role }, jwt_secret, { expiresIn: expirein });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       maxAge: expirein * 1000,
//     });

//     res.status(200).json({ 
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//       }
//     });
//   } catch (error) {
//     console.log("Error in logging in user:", error);
//     res.status(400).json({ message: "Error in logging in user" });
//   }
// };



// get single user
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findById(id).select("-password");
    if (!singleUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({  
      success: true,
      data: singleUser
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

// ✅ Approve or activate user (admin only)
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Raadi user-ka
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Haddii user horey u active yahay
    if (user.status === "active") {
      return res.status(400).json({ message: "User is already active" });
    }

    // Update status
    user.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: {
        id: user._id,
        username: user.username,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Error approving user" });
  }
};


// ✅ inactive user (admin only)
export const inactiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Raadi user-ka
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Haddii user horey u active yahay
    if (user.status === "inactive") {
      return res.status(400).json({ message: "User is already active" });
    }

    // Update status
    user.status = "inactive";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User inactived successfully",
      data: {
        id: user._id,
        username: user.username,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Error approving user" });
  }
};

// update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;  
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  }
  catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {email, username, phone ,role } = req.body;

    // Hel user-ka, password-na ha la soo celiyo si loo hubiyo
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Username update
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    // ✅ Phone update
    if (phone) {
      user.phone = phone;
    }
    if (role) {
      user.role = role;
    }

    await user.save();

    const { password, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({ message: "Logged out" });
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ FORGOT PASSWORD (EMAIL ONLY)
 * body: { email }
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is not found plz try again" });
    }

    // samee reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background-color: #000000; padding: 25px; text-align: center;">
        <h1 style="color: #fffdfd; margin: 0; font-size: 24px;">
          Nootayo Boqole
        </h1>
        <p style="color: #ffffff; margin: 5px 0 0; font-size: 14px;">
          Official Notification
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 35px; text-align: center;">
        <h2 style="color: #111827; margin-bottom: 15px;">
          Password Reset Request
        </h2>

        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
          Waxaad codsatay inaad bedesho password-ka akoonkaaga.
          Riix badhanka hoose si aad u dejiso password cusub.
        </p>

        <!-- Button -->
        <div style="margin: 30px 0;">
          <a href="${resetURL}"
            style="
              display: inline-block;
              padding: 14px 28px;
              background-color: #030303;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 8px;
              font-size: 15px;
            ">
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 13px;">
          Link-kan wuxuu shaqeynayaa <strong>10 daqiiqo</strong> oo keliya.
        </p>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
          Haddii aadan codsan password reset, fadlan iska indha tir email-kan.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #111827; padding: 20px; text-align: center;">
        <p style="color: #050505; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} Nootayo Boqole
        </p>
        <p style="color: #d1d5db; font-size: 12px; margin-top: 5px;">
          This is an automated system email.
        </p>
      </div>

    </div>
  </div>
`;


    await sendEmail({
      to: user.email,
      subject: "Reset Password - Boqole Notary",
      html,
    });

    res.status(200).json({
      message: "Reset link is succsufully✅",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email is in corect" });
  }
};

/**
 * ✅ RESET PASSWORD
 * params: token
 * body: { password }
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Link is Expire" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password  change succsusfuly ✅",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reset password error" });
  }
};
// ✅ CHANGE PASSWORD (user logged-in)
// body: { oldPassword, newPassword, confirmPassword }
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan fields-ka" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password cusub ugu yaraan 6 xaraf ha noqdo" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password-yada cusub isma la mid aha" });
    }

    // user from auth middleware
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // verify old password
    const ok = await user.comparePassword(oldPassword);
    if (!ok) return res.status(401).json({ message: "Old password waa qalad" });

    // update (haddii User model uu pre('save') hash gareeyo, waa ok)
    user.password = newPassword;

    // reset tokens haddii ay jiraan
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password waa la beddelay ✅" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Change password error" });
  }
};