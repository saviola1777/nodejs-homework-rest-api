const express = require('express')

const ctrl = require("../../controllers/controllers-contact")

const { validateBody } = require("../../uttils/index")

const { schema } = require("../../models/contact")

const uthenticate = require("../../middlewares/authenticate")

const router = express.Router()


router.get('/', uthenticate, ctrl.getAllContacts)

router.get("/:id", uthenticate, ctrl.getContactsById)

router.post('/', uthenticate, validateBody(schema.addSchema), ctrl.addContacts)

router.put('/:id', uthenticate, ctrl.updateContacById)

router.patch('/:id/favorite', uthenticate, validateBody(schema.updateSchema), ctrl.updateFavoriteById)

router.delete('/:id', uthenticate, ctrl.deleteContacts)

module.exports = router
