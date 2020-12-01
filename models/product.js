const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        requires: true,
        maxlenght: 32
    },
    description : {
        type: String,
        trim: true,
        requires: true,
        maxlenght: 3000
    },
   price : {
        type: Number,
        trim: true,
        requires: true,
        maxlenght: 32
    },
    category : {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number
    },
    sell: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: Boolean
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);