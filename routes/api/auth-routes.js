const express = require("express")

const router = express.Router()

const ctrl = require("../../controllers/auth-controllers")

const { validateBody } = require("../../uttils/index")

const { registerSchema, emailSchema } = require("../../models/user")

const authenticate = require("../../middlewares/authenticate")

const upload = require("../../middlewares/upload")

router.post("/register", validateBody(registerSchema), ctrl.register)

router.get("/verify/:verificationToken", ctrl.verify)

router.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail)

router.post("/login", ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent)

router.post("/logout", authenticate, ctrl.logout)

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router

