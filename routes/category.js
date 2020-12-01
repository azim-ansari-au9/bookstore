const express = require('express');
const router = express.Router();

const { create, catById, read, update, remove, list } = require('../controllers/category');
// const { catById, read } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/authentication');
const { userById } = require("../controllers/user");
// const { update, remove } = require('../models/user');


//routes for user 
router.get('/category/:categoryId', read)
router.get('/catgs', list)
router.post('/category/create/:userId',requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId',isAdmin, update);
router.delete('/category/create/:userId',isAdmin, remove);

router.param('categoryId', catById);
router.param('userId', userById );




module.exports = router;