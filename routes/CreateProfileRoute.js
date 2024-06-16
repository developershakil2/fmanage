const createUserProfile = require("../controllers/CreateProfileController");
const  express = require("express");

const router = express.Router();


router.post('/create-user/:username', createUserProfile)









module.exports = router