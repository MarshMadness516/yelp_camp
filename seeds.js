const mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment');

let data = [
    {
        name: "Pisgah National Forest", 
        image: "https://source.unsplash.com/ykjsf518lZY",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Lake Lure", 
        image: "https://source.unsplash.com/jfVCnapgD5M",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Shortoff Mountain", 
        image: "https://source.unsplash.com/9EwxGJdTJNo",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }

];

function seedDB() {
    // remove all campgrounds
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err);
        } 
        console.log("REMOVED CAMPGROUNDS");
        // add new campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("CAMPGROUND ADDED");
                    // create comments for each campground
                    Comment.create(
                        {
                            text: "This place is great but I wish there was internet",
                            author: "Homer"
                        }, (err, comment) => {
                           if(err) {
                               console.log(err);
                           } else {
                               campground.comments.push(comment);
                               campground.save();
                               console.log("COMMENT CREATED");
                           }
                        });
                }
            });
        });
    });
    
    
    
    // add a few comments
};

module.exports = seedDB;