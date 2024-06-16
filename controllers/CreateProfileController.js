const Web3 = require('web3');
const User = require('../models/User');
require('dotenv').config();


const createUserProfile = async (req, res) => {
    const  username = req.params.username;
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Generate a new wallet
      const newAccount = Web3.eth.accounts.create();
  
      // Create a new user profile
      const newUser = new User({
        username,
        walletAddress: newAccount.address,
        walletSecret: newAccount.privateKey, // Store the private key securely
        inGameGold: 0,
      });
  
      await newUser.save();
      const users = {
        walletAddress:newUser.walletAddress,
        discordUserName:newUser.username,
        GoldCoin:newUser.inGameGold
    }

  
      res.status(201).json({ message: 'User profile created successfully', user: users });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


  module.exports = createUserProfile;