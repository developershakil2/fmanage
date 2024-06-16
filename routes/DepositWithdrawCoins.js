const express = require('express');
const {  depositCoins,
    withdrawCoins} = require('../controllers/CoinWithdrawDepositController')



    const router = express.Router()


    router.post('/deposit-coin/:chainId/:FundManageSmartContract/:username/:amount', depositCoins)
    router.post('/withdraw-coin/:chainId/:FundManageSmartContract/:username/:amount', withdrawCoins)




    module.exports = router;