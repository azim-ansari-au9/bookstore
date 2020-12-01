const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        requires: true,
        maxlenght: 32
    }
},
    { timestamps: true }
);



module.exports = mongoose.model("Category", categorySchema);