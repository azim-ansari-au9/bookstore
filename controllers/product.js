const formidable = require('formidable');
const _ = require('loadsh');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Product = require('../models/product');

exports.productById = (req, res, next, id) =>{
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product
        next();
    })
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image couldn't be uploaded",
            })
        }
        //check the all fields
        const {name, description, price, category, quantity, shipping} = fields
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        let product = new Product(fields)
        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        //files.photo.type
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

//for the delete post.
exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted succefully"
        });
    });
}

//create update 
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image couldn't be uploaded",
            })
        }
        //check the all fields
        const {name, description, price, category, quantity, shipping} = fields
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        let product = req.product
        product = _.extend(product, fields)
        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        //files.photo.type
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
 
//product listed by sorted on the basis of product sell ,order, arrivals

exports.list = (req, res) => {
    // for the product sell sort by order using 
    //syntax ("http://localhost:8000/apiproducts?sortBy=sell&order=desc&limit=5") 
     let limit = req.query.limit ? parseInt(req.query.limit) : 6
     // for the sell sortBy using synntax ("http://localhost:8000/api/products?sortBy=createdAt&order=desc&limit=5")
     let order = req.query.order ? req.query.order : 'asc'
     //
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    
     Product.find().select("-photo").populate('category').sort([[sortBy, order]]).limit(limit)
     .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: 'Products not found'
            })
        }
        res.json(products)
     })
};

//related list of product.
//it will find product in category product.
//other product that has the same category
exports.relatedList = (req, res) => {
    let limit = req.query.limt ? parseInt( req.query.limt ): 6;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit).populate('category','_id name')
    .exec((err, products) => {
        if(err) {
            return res.status(400).json({
                error: "No product"
            })
        }
        res.json(products)
    })
}

//list of category and related category
exports.listCatgs = (req, res ) => {
    Product.distinct('category' , {} , (err, catgs) => {
        if(err) {
            return res.status(400).json({
                error: "No category"
            })
        }
        res.json(catgs)
    })
}

//  list of product searched
exports.searchFilters = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? req.body.limit : '95'
    let skip = parseInt(req.body.skip);
    let testInput = { };
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                testInput[key] = {
                    $gte: req.body.filters[key] [0],  //greater than $gte
                    $lte: req.body.filters[key] [1]
                };
            } else {
                testInput[key] = req.body.filters[key]
            }
        }
    }
    Product.find(testInput).select("-photo").populate('category').sort([[sortBy, order]]).skip(skip)
    .exec((err, data) => {
        if (err){
        return res.status(400).json({
            error: "No product"
           });
        }
        res.json({
            size: data.length,
            data
        })
    })
};

//work as midddleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set ("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};