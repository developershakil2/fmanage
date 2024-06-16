const mongoose = require('mongoose')




const UserSchema = new mongoose.Schema({
    username:{
     type:String,
    },
    walletAddress:{
     type:String
    },
    walletSecret:{
     type:String
    },
    inGameGold:{
        type:Number
    }
})


const UserModel = mongoose.model('User', UserSchema );


module.exports = UserModel;