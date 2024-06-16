const {depositTokens,
    withdrawTokens,} = require('../controllers/TokenWithdrawDepositController')
    const express = require('express')

const router = express.Router()

router.post('/deposit-token/:chainId/:FundManageSmartContract/:token/:username/:amount', depositTokens);
router.post('/withdraw-token/:chainId/:FundManageSmartContract/:token/:username/:amount', withdrawTokens);





module.exports = router;