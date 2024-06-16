const express = require('express')
const MainController = require('../controllers/MainController')

  const router = express.Router();


  router.get('/get-transactions/:chainId', MainController);



  module.exports = router;