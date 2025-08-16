import express from "express";
import {
  adminLoginController,
  adminHomeController,
  adminLogoutController,
  teacherRegistrationLinkController,
} from "../controller/adminController.js";
import { message, status } from "../utils/statusMassage.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var adminRouter = express.Router();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const authenticateJWT = (request, response, next) => {
  try {
    const token = request.cookies.admin_jwt;
    if (!token) {
      console.log("Token not Found");
      response.render("adminLogin.ejs", {
        message: message.AUTHENTICATE_ERROR,
        status: status.ERROR,
      });
    } else {
      jwt.verify(token, ADMIN_SECRET_KEY, (error, payload) => {
        if (error) {
          console.log("Error while verifying token : ", error);
          response.render("adminLogin.ejs", {
            message: message.JWT_VERIFYING_ERROR,
            status: status.ERROR,
          });
        } else {
          request.adminPayload = payload;
          next();
        }
      });
    }
  } catch (error) {
    console.log("Error inside authenticateJWT : ", error);
    response.render("adminLogin.ejs", {
      message: message.SOMETHING_WENT_WRONG,
      status: status.ERROR,
    });
  }
};
const authorizeJWT = (request, response, next) => {
  try {
    if (request.adminPayload.role == "admin") {
      next();
    } else {
      console.log("Else part of authorizeJWT executes");
      response.render("adminLogin.ejs", {
        message: message.AUTHORIZE_ERROR,
        status: status.ERROR,
      });
    }
  } catch (error) {
    console.log("Error inside authorizeJWT : ", error);
    response.render("adminLogin.ejs", {
      message: message.AUTHORIZE_ERROR,
      status: status.ERROR,
    });
  }
};
adminRouter.post("/adminLogin", adminLoginController);
adminRouter.get(
  "/adminHome",
  authenticateJWT,
  authorizeJWT,
  adminHomeController
);
adminRouter.get("/adminLogout", authenticateJWT, adminLogoutController);
adminRouter.post(
  "teacherRegistrationLink",
  authenticateJWT,
  teacherRegistrationLinkController
);

export default adminRouter;
