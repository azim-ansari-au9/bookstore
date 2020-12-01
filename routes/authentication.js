const express = require('express');
const router = express.Router();

const { signup, signin, signout, requireSignin } = require('../controllers/authentication');
const { userSignupValidator } = require('../validator')

//get method

router.post('/signup',userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// middleware require for signin.

// router.get("/hello", requireSignin, (req, res) => {
//     res.send("Hello there")
// })


module.exports = router;