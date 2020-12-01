const Category = require("../models/category");
const { errorHandler } = require('../helpers/dbErrorHandler');
const category = require("../models/category");

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({ data })
    })
}

//catById:
exports.catById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                error: 'Category not found'
            });
        }
        req.category = category;
        next();
    })
}

//category read:
exports.read = (req, res) => {
    return res.json(req.category);
}

//category update:
exports.update = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler
            })
        }
        res.json(data)
    })
}

//delete category;
exports.remove = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.remove((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "successfully deleted"
        })
    })
}

//list of category:
exports.list= (req, res) => {
    Category.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        } 
        res.json(data)
    })
}