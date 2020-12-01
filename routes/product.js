const express = require('express');
const router = express.Router();

const { create, productById, read, remove } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/authentication');
const { userById } = require("../controllers/user");
const { update, list, relatedList, listCatgs, searchFilters, photo } = require('../controllers/product');

//get method
router.get('/product/:productId', read)
router.post('/product/create/:userId',requireSignin, isAuth, isAdmin, create);
router.put('/product/:productId/:userId', isAdmin, update);
router.delete('/product/:productId/:userId', isAdmin,  remove);

router.get('/products',list)
router.get('/products/related/:productId', relatedList)
router.get('/products/catgs' , listCatgs )
router.post('/products/by/search',searchFilters)
router.get('/product/photo/:productId', photo)

router.param('userId', userById );
router.param('productId', productById );




module.exports = router;