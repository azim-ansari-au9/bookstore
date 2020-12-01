const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/authentication');

const { userById, read, update } = require("../controllers/user");
 
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) =>{
    res.json({
        user: req.profile
    })
} );


router.get('/user/:userId', isAdmin, read)
router.put('/user/:userId',isAdmin, update)

router.param('userId', userById );

module.exports = router;