const ethers = require('ethers')
const ABI = require('../abi/FundsManagement.json');

const CoinBalance = async (req, res, next)=>{
    try{ 
        const retriveId = req.params.chainId;
        const contractAddress = retriveId.split('=')[1];
        const chainId = retriveId.split('=')[0];
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

     const contract = new ethers.Contract(contractAddress.toLowerCase(), ABI, provider);
      const getTrans = await contract.getCoinBalance();

       if(getTrans){
        return  res.status(200).json({message:'success',data:getTrans})
       }else{
        return res.status(404).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID'})
       }

    }catch(error){
        return res.status(500).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID', error})
    }
}

const CoinBalanceOf = async (req, res, next)=>{
    try{ 
        const retriveId = req.params.chainId;
        const contractAddress = retriveId.split('=')[1];
        const user = retriveId.split('=')[2]
        const chainId = retriveId.split('=')[0];
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

     const contract = new ethers.Contract(contractAddress.toLowerCase(), ABI, provider);
      const getTrans = await contract.getCoinBalanceOf(user);

       if(getTrans){
        return  res.status(200).json({message:'success',data:getTrans})
       }else{
        return res.status(404).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID'})
       }

    }catch(error){
        return res.status(500).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID or user wallet address', error})
    }
}

const TokenBalance = async (req, res, next)=>{
    try{ 
        const retriveId = req.params.chainId;
        const contractAddress = retriveId.split('=')[1];
        const chainId = retriveId.split('=')[0];
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

     const contract = new ethers.Contract(contractAddress.toLowerCase(), ABI, provider);
      const getTrans = await contract.getTokenBalance();

       if(getTrans){
        return  res.status(200).json({message:'success',data:getTrans})
       }else{
        return res.status(404).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID'})
       }

    }catch(error){
        return res.status(500).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID', error})
    }
}

const TokenBalanceOf = async (req, res, next)=>{
    try{ 
        const retriveId = req.params.chainId;
        const contractAddress = retriveId.split('=')[1];
        const user = retriveId.split('=')[2]
        const chainId = retriveId.split('=')[0];
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

     const contract = new ethers.Contract(contractAddress.toLowerCase(), ABI, provider);
      const getTrans = await contract.getTokenBalanceOf(user);

       if(getTrans){
        return  res.status(200).json({message:'success',data:getTrans})
       }else{
        return res.status(404).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID'})
       }

    }catch(error){
        return res.status(500).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID or user wallet address', error})
    }
}



const getTransactionHistory = async (req, res, next)=>{
    try{ 
        const retriveId = req.params.chainId;
        const contractAddress = retriveId.split('=')[1];
        const user = retriveId.split('=')[2]
        const chainId = retriveId.split('=')[0];
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

     const contract = new ethers.Contract(contractAddress.toLowerCase(), ABI, provider);
      const getTrans = await contract.getTransactionHistory(user);

       if(getTrans){
        return  res.status(200).json({message:'success',data:getTrans})
       }else{
        return res.status(404).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID'})
       }

    }catch(error){
        return res.status(500).json({message:'please check smart contract adderss or chain ID you shouldnt request with invalid smart contracts or chain ID or user wallet address', error})
    }
}

module.exports = {TokenBalance, CoinBalance, CoinBalanceOf, TokenBalanceOf,getTransactionHistory};