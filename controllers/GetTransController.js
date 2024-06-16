const TransactionModel = require('../models/Transactions')




const getTrans = async (req, res, next)=>{

    try{

        const  trans = await TransactionModel.find();
        if(trans){
            return res.status(201).json({message:'success',transaction:trans})
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({message:'something went wrong'})
    }
}



module.exports = getTrans;