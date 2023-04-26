const express = require("express")

const router = express.Router()

const ctrl = require("../../controllers/auth-controllers")

const { validateBody } = require("../../uttils/index")

const { registerSchema } = require("../../models/user")

const authenticate = (require("../../middlewares/authenticate"))

router.post("/register", validateBody(registerSchema), ctrl.register)

router.post("/login", ctrl.login)

router.get("/current", authenticate, ctrl.getCurrent)

router.post("/logout", authenticate, ctrl.logout)

module.exports = router

