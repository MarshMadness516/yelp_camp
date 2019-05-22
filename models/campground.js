const mongoose = require('mongoose');


// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            // not embedding comments, just referencing the comments by id
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


// Set up data model and export
module.exports = mongoose.model("Campground", campgroundSchema);