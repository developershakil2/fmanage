const GetUserController = require('../controllers/GetUserController')
const express = require('express')

const router = express.Router()


router.get('/get-user/:username', GetUserController)




module.exports = router