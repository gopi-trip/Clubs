import { Router } from "express";
import { registerUser, getUserDetails, getUsersByClub } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Registration route
router.post(
  "/register",
  upload.fields([
    {
      name: "idCard",
      maxCount: 1
    }
  ]),
  registerUser
);

// Protected routes (require authentication)
router.get("/user/:userId", verifyJWT, getUserDetails);
router.get("/club/:club", verifyJWT, getUsersByClub);

export default router;