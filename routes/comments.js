const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
   
});

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
   // look up campground with id
   Campground.findById(req.params.id, (err, campground) => {
      if(err) {
          console.log(err);
          res.redirect('/campgrounds');
      } else {
        // create new comment
        Comment.create(req.body.comment, (err, comment) => {
           if(err) {
               console.log(err);
           } else {
               // add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               // save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash('success', "Comment successfully posted")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
        // connect new comment to campground
        // redirect to show page of current campground
      }
   });

});

// Comments Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash('error', "Campground not found");
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
    
});

// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// Comments Destroy
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment successfully deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});



module.exports = router;