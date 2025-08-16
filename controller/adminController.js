import adminSchema from "../model/adminSchema.js";
import { message } from "../utils/statusMassage.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailer from "./mailer.js";
dotenv.config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export const adminLoginController = async (request, response) => {
  try {
    const { email, password } = request.body;
    const adminObj = await adminSchema.findOne({ email: email });
    if (adminObj) {
      const existingPassword = adminObj.password;
      const status = await bcrypt.compare(password, existingPassword);
      if (status) {
        const adminPayload = {
          email: email,
          role: "admin",
        };
        const expiryTime = {
          expiresIn: "365d",
        };
        const token = jwt.sign(adminPayload, ADMIN_SECRET_KEY, expiryTime);
        response.cookie("admin_jwt", token, {
          httpOnly: true,
          maxAge: 72000 * 60 * 60,
        });
        //response.redirect("/admin/adminHome");
        response.render("adminHome.ejs", {
          email: email,
          message: "",
          status: "",
        });
      } else {
        response.render("adminLogin.ejs", {
          message: message.INCORRECT_PASSWORD,
          status: message.ERROR,
        });
      }
    } else {
      response.render("adminLogin.ejs", {
        message: message.INCORRECT_EMAIL,
        status: message.ERROR,
      });
    }
  } catch (error) {
    console.log("Error in adminLoginController: ", error);
    response.render("adminLogin.ejs", {
      message: message.SOMETHING_WENT_WRONG,
      status: message.ERROR,
    });
  }
};

export const adminHomeController = async (request, response) => {
  try {
    response.render("adminHome.ejs", {
      email: request.adminPayload.email,
      message: "",
      status: "",
    });
  } catch (error) {
    console.log("Error in adminHomeController: ", error);
    response.render("adminLogin.ejs", {
      message: message.SOMETHING_WENT_WRONG,
      status: message.ERROR,
    });
  }
};

export const adminLogoutController = async (request, response) => {
  try {
    response.clearCookie("admin_jwt");
    console.log("logout successfully");
    response.render("adminLogin.ejs", {
      message: message.LOGOUT_SUCCESSFULLY,
      status: message.SUCCESS,
    });
  } catch (error) {
    console.log("Error in adminLogoutController: " + error);
    response.render("adminLogin.ejs", {
      message: message.SOMETHING_WENT_WRONG,
      status: message.ERROR,
    });
  }
};

export const teacherRegistrationLinkController = async (request, response) => {
  try {
    const teacherEmail = request.body.email;
    console.log("Teacher Email: ", teacherEmail);
  } catch (error) {
    console.log("Error in teacherRegistrationLinkController: ", error);
    response.render("adminLogin.ejs", {
      email: request.adminPayload.email,
      message: message.SOMETHING_WENT_WRONG,
      status: message.ERROR,
    });
  }
};
