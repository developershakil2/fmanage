const express = require('express')
const getTrans = require('../controllers/GetTransController')

const router = express.Router()

router.get('/transactions', getTrans)





module.exports = router;