const User = require('../models/User');


const GetUserController = async (req, res, next)=>{
    const user = req.params.username;

    try{
        const getUser= await User.findOne({username:user})
        if(!getUser){
            return res.status(404).json({message:'user not found'})
        }
       
        const users = {
            walletAddress:getUser.walletAddress,
            discordUserName:getUser.username,
            GoldCoin:getUser.inGameGold
        }

       return res.status(201).json({message:'user match', user:users})

    }catch(error){
        return res.status(500).json({message:'something went wrong'})
        console.log(error)
    }

}

module.exports = GetUserController;