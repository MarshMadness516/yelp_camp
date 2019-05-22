const express = require('express');
// use express router instead of app; change all instances of app in routes to router
const router = express.Router();
const Campground = require('../models/campground');
// if you only require a directory, it will automatically require the contents of
// index.js as its default
const middleware = require('../middleware');


// INDEX route - RESTful
router.get('/', (req, res) => {
   // Get all campgrounds from DB
   Campground.find({}, (err, allCampgrounds) => {
       if(err) {
           console.log(err);
       } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
       }
   });
});

// NEW route - RESTful
router.get("/new", middleware.isLoggedIn, (req, res) => {
   res.render('campgrounds/new'); 
});


// CREATE route - RESTful
router.post('/', middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let desc = req.body.description;
    let author = { 
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        price: price,
        description: desc,
        author: author
    };
    // Create new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            // redirect back to campgrounds
            res.redirect('/campgrounds');
        }
    });
    
});


// SHOW route - RESTful
// Must come after /campgrounds/new route because the /:id pattern will match
// the /new path and we will always be taken to the SHOW page and not get the
// CREATE form page
router.get('/:id', (req, res) => {
    // find campground with provided id, populating comments, executing code
    // this will mean comments will be inside the foundCampground
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    // render show template with that campground
    
});

// EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground}); 
    });
});

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            // redirect somewhere
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


// DESTROY campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
       if(err) {
           res.redirect('/campgrounds');
       } else {
           req.flash('success', "Campground successfully deleted");
           res.redirect('/campgrounds');
       }
    });
});





module.exports = router;