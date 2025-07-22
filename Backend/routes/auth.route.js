import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

// // ✅ Add this checkAuth route and protect it
// router.get("/check", protectRoute, (req, res) => {
//   res.json(req.user); // req.user is added by protectRoute middleware
// });

// router.post("/signup", signupUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.put("/update-profile", protectRoute, updateProfile);

export default router;
