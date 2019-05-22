// all middleware goes here
const Campground = require('../models/campground'),
    Comment      = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
           if(err || !foundCampground) {
               req.flash('error', 'Campground not found');
               res.redirect('back');
           } else {
               if(foundCampground.author.id.equals(req.user._id)) {
                    return next();
               } else {
                   req.flash('error', "You don't have permission to do that");
                   res.redirect('back');
               }
           }
        });
    } else {
        req.flash('error', 'Must log in first');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
           if(err || !foundComment) {
               req.flash('error', 'Comment not found');
               res.redirect('back');
           } else {
               if(foundComment.author.id.equals(req.user._id)) {
                   return next();
               } else {
                   req.flash('error', "You don't have permission to do that");
                   res.redirect('back');
               }
           }
        });
    } else {
        req.flash('error', "Must log in first");
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    // add info to the flash and then renders flash on next page loaded
    // first arg determines key to be called later, second determines text shown
    req.flash('error', 'Must log in first');
    res.redirect('/login');
};

// module.exports
module.exports = middlewareObj;