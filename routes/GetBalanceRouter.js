const express= require('express')
const {TokenBalance, CoinBalance, CoinBalanceOf,TokenBalanceOf,getTransactionHistory} = require('../controllers/GetBalanceController')
const router = express.Router();


router.get('/token/:chainId', TokenBalance)
router.get('/coin/:chainId', CoinBalance)
router.get('/coin-balance-of/:chainId',CoinBalanceOf)
router.get('/token-balance-of/:chainId', TokenBalanceOf)
router.get('/user-history/:chainId', getTransactionHistory)



module.exports = router;