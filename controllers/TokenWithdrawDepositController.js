
const User = require('../models/User');
require('dotenv').config();
const { ethers } = require('ethers');
const ABI = require('../abi/FundsManagement.json');
const TransactionModel = require('../models/Transactions')

// // Deposit Tokens
// const depositTokens = async (req, res) => {
//   const dep = req.params.deposit;

//   const chainId = dep.split('=')[0];
//   const FundManageSmartContract = dep.split("=")[1]
//   const token = dep.split('=')[2]
//   const username = dep.split('=')[3]
//   const amount = dep.split('=')[4]

//   try {
//     const user = await User.findOne({ username:username });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let provider;
//     if(chainId == 97){
//       provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545')
//     }else if(chainId == 56){
//         provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/')
//     } else if(chainId == 1){
//         provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     }else if(chainId == 59144){
//         provider = new ethers.providers.JsonRpcProvider('https://linea-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     }else if(chainId == 137){
//         provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     } else if(chainId == 10){
//         provider = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     }else if(chainId == 43114){
//         provider = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     }else if(chainId == 42161){
//         provider = new ethers.providers.JsonRpcProvider('https://arbitrum-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513')
//     }
//     const contract = new ethers.Contract(token, tokenABI, provider)
//     const userWallet = new ethers.Wallet(user.walletSecret, provider);
//     const trans = await contract.connect(userWallet).approve(FundManageSmartContract, ethers.utils.parseEther(String(amount)))
      
//     const rec = await trans.wait()
   
//       if(rec == 1){
//         const tra = await contract.connect(userWallet).transferFrom(user.walletSecret, FundManageSmartContract, ethers.utils.parseEther(String(amount)));
//         const receipt = await tra.wait();
//       if(receipt == 1 ){
//            // Update the user's in-game gold balance
//     user.inGameGold += amount;
//     await user.save();

//    return res.status(200).json({ message: 'Tokens deposited successfully', user });
//       }else{
//         return res.status(400).json({message:'you dont have enough token balance '})
//       }
   
//       }else{
//         return res.status(404).json({message:'token didnt approve'})
//       }

 
//   } catch (error) {
//   return  res.status(500).json({ message: 'Server error', error });
//   }
// };


const depositTokens = async (req, res) => {
    try {
        const { chainId, FundManageSmartContract, token, username, amount } = req.params;
        const user = await User.findOne({ username });
        let provider;
        switch (parseInt(chainId)) {
            case 97:
                provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
                break;
            case 56:
                provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');
                break;
            case 1:
                provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            case 59144:
                provider = new ethers.providers.JsonRpcProvider('https://linea-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            case 137:
                provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            case 10:
                provider = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            case 43114:
                provider = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            case 42161:
                provider = new ethers.providers.JsonRpcProvider('https://arbitrum-mainnet.infura.io/v3/d44d1e97c9f842babdc420193e589513');
                break;
            default:
                return res.status(400).json({ message: 'Unsupported chainId' });
        }

        if (!ethers.utils.isAddress(user.walletAddress)) {
            return res.status(400).json({ message: 'Invalid Ethereum address' });
          }
          if (!ethers.utils.isAddress(FundManageSmartContract)) {
            return res.status(400).json({ message: 'Invalid Ethereum address' });
          }
          if (!ethers.utils.isAddress(token)) {
            return res.status(400).json({ message: 'Invalid Ethereum address' });
          }
    
          const userWallet = new ethers.Wallet(user.walletSecret, provider);
        const contract = new ethers.Contract(FundManageSmartContract, ABI, userWallet);
       

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        try {
            // Approve FundManageSmartContract to spend tokens on behalf of user
            const approvalTx = await contract.connect(userWallet).depositTokens(ethers.utils.parseEther(String(amount)), token, { gasLimit: 300000 });

            // Check if approval transaction succeeded
            if (!approvalTx) {
                return res.status(500).json({ message: 'Token approval failed' });
            }
                
            const transactions = new TransactionModel({
              discordUser:username,
              userWalletAddress:user.walletAddress,
              tokenAddress:token,
              depositAmount:parseInt(amount)
            });

            await transactions.save()

            // // Perform the transfer after approval
            // const transferTx = await contract.connect(userWallet).transfer(FundManageSmartContract, ethers.utils.parseEther(String(amount)), { gasLimit: 300000 });
                  
                // Update user's inGameGold
                user.inGameGold += parseFloat(amount); // Ensure amount is parsed correctly if necessary
                await user.save();
                const users =  {discordUserName:user.username,walletAddress:user.walletAddress, goldCoin:user.inGameGold}
                return res.status(200).json({ message: 'Tokens deposited successfully', users });
         
        } catch (error) {
            console.error('Token transfer error:', error);
            return res.status(500).json({ message: 'Token transfer error', error });
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Withdraw Tokens
const withdrawTokens = async (req, res) => {
 
  try {
    const { chainId, FundManageSmartContract, token, username, amount } = req.params;
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

    if (!ethers.utils.isAddress(user.walletAddress)) {
        return res.status(400).json({ message: 'Invalid Ethereum address' });
      }
      if (!ethers.utils.isAddress(FundManageSmartContract)) {
        return res.status(400).json({ message: 'Invalid Ethereum address' });
      }
      if (!ethers.utils.isAddress(token)) {
        return res.status(400).json({ message: 'Invalid Ethereum address' });
      }

    const userWallet = new ethers.Wallet(user.walletSecret, provider);
    const contract = new ethers.Contract(FundManageSmartContract, ABI, userWallet);
    const trans = await contract.connect(userWallet).withdrawTokens(ethers.utils.parseUnits(amount.toString(), 18), token, { gasLimit: 300000 })
       
        user.inGameGold -= parseFloat(amount);
        await user.save();
        const users =  {discordUserName:user.username,walletAddress:user.walletAddress, goldCoin:user.inGameGold}
                return res.status(200).json({ message: 'Tokens deposited successfully', users });
       

  } catch (error) {
  return  res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  depositTokens,
  withdrawTokens,
};
