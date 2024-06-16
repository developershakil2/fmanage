
const User = require('../models/User');
require('dotenv').config();
const { ethers } = require('ethers');
const ABI = require('../abi/FundsManagement.json');
const TransactionModel = require('../models/Transactions');
const { default: mongoose } = require('mongoose');

const depositCoins = async (req, res) => {
  const { chainId, FundManageSmartContract, username, amount } = req.params;

  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ username: username }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    // Define provider based on chainId
    let provider;
    switch (parseInt(chainId)) {
      case 97:
        provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
        break;
      case 56:
        provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');
        break;
      case 1:
        provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      case 59144:
        provider = new ethers.providers.JsonRpcProvider('https://linea-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      case 137:
        provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      case 10:
        provider = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      case 43114:
        provider = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      case 42161:
        provider = new ethers.providers.JsonRpcProvider('https://arbitrum-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        break;
      default:
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Unsupported chainId' });
    }

    const userWallet = new ethers.Wallet(user.walletSecret, provider);
    const contract = new ethers.Contract(FundManageSmartContract, ABI, userWallet);

    // Execute the deposit transaction
    const trans = await contract.connect(userWallet).depositCoins({ value: ethers.utils.parseEther(amount.toString()) });

    // Create and save the transaction document
    const transaction = new TransactionModel({
      discordUser: username,
      userWalletAddress: user.walletAddress,
      tokenAddress: 'native coin',  // Assuming FundManageSmartContract is the token address
      depositAmount: amount,
    });

    await transaction.save({ session });

    // Update the user's in-game gold balance
    user.inGameGold += parseInt(amount);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    const users = { discordUserName: user.username, walletAddress: user.walletAddress, goldCoin: user.inGameGold };
    return res.status(200).json({ message: 'Coins deposited successfully', users });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Server error', error });
  }
};


// Withdraw Tokens
const withdrawCoins = async (req, res) => {
 
  try {
    const { chainId, FundManageSmartContract, username, amount } = req.params;
  
      let provider;
      if(chainId == 97){
        provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545')
      }else if(chainId == 56){
          provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/')
      } else if(chainId == 1){
          provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      }else if(chainId == 59144){
          provider = new ethers.providers.JsonRpcProvider('https://linea-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      }else if(chainId == 137){
          provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      } else if(chainId == 10){
          provider = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      }else if(chainId == 43114){
          provider = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      }else if(chainId == 42161){
          provider = new ethers.providers.JsonRpcProvider('https://arbitrum-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
      }
    
      const user = await User.findOne({ username:username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    if (user.inGameGold < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
  
    const userWallet = new ethers.Wallet(user.walletSecret, provider);
    const contract = new ethers.Contract(FundManageSmartContract, ABI, userWallet)
 
    const trans = await contract.connect(userWallet).withdrawCoins({from:user.walletAddress, value:ethers.utils.parseEther(amount.toString()), gasLimit:300000})
    

    // Update the user's in-game gold balance
    user.inGameGold -= parseInt(amount);
    await user.save();


    const users =  {discordUserName:user.username,walletAddress:user.walletAddress, goldCoin:user.inGameGold}
    return res.status(200).json({ message: 'coins withdrawn successfully', users });
  

  } catch (error) {
  return  res.status(500).json({ message: 'Server error', error });
  }
};




module.exports = {
  depositCoins,
  withdrawCoins,
};
