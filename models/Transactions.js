const mongoose = require('mongoose')




const TransactionSchema = new mongoose.Schema({
    discordUser:{type:String},
    userWalletAddress:{type:String},
    tokenAddress:{type:String},
    depositAmount:{type:Number}
})


const TransactionModel = mongoose.model("Transaction", TransactionSchema);


module.exports = TransactionModel;