const router = require("express").Router();

const {
  registerController,
  resendActivationController,
  activationController,
  loginController,
  logoutController,
  getUserController,
  updateUserController,
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController,
  updateEmailController,
  resetEmailController,
  addAdminController,
  isAuthenticated,
  requireSignIn,
  requestPayment,
  getUsersByRole,
  deleteUserController,
} = require("../controllers/user.controller");

const { authorizeOwner, isAdmin } = require("../../helpers/authorization");
const {
  validRegister,
  validLogin,
  resetPasswordValidator,
} = require("../../helpers/validators");

router.post("/register", validRegister, registerController);
router.post("/resendActivation", resendActivationController);
router.post("/activate", activationController);
router.post("/login", validLogin, loginController);
router.post("/logout", logoutController);
router.post("/forgotPassword", forgotPasswordController);
router.post("/resetPassword", resetPasswordValidator, resetPasswordController);
router.post(
  "/updateEmail/:id",
  isAuthenticated,
  authorizeOwner,
  updateEmailController
);

router.post("/resetEmail", resetEmailController);
router.post("/requireSignIn", isAuthenticated, requireSignIn);

router.post("/admin", isAuthenticated, isAdmin, addAdminController);

router.get("/:id", getUserController);
router.get("/", isAuthenticated, isAdmin, getUsersByRole);

router.patch("/:id", isAuthenticated, authorizeOwner, updateUserController);
router.patch(
  "/password/:id",
  isAuthenticated,
  authorizeOwner,
  updatePasswordController
);

router.post("/requestPayment", isAuthenticated, requestPayment);

router.delete("/:id", isAuthenticated, isAdmin, deleteUserController);

module.exports = router;
