const express = require('express')

const ctrl = require("../../controllers/controllers-contact")

const { validateBody } = require("../../uttils/index")

const { schema } = require("../../models/contact")

const router = express.Router()


router.get('/', ctrl.getAllContacts)

router.get("/:id", ctrl.getContactsById)

router.post('/', ctrl.addContacts)

router.put('/:id', ctrl.updateContacById)

router.patch('/:id/favorite', validateBody(schema.updateSchema), ctrl.updateFavoriteById)

router.delete('/:id', ctrl.deleteContacts)

module.exports = router
