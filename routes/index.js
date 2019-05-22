const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// root route
router.get('/', (req, res) => {
    res.render('landing');
});

// =================
//    AUTH ROUTES
// =================
// show sign up form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
           req.flash('error', err.message);
           return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', "Successfully registered \"" + user.username + "\" for YelpCamp");
            res.redirect('/campgrounds');
        });
    });
});

// =================
//   LOGIN ROUTES
// =================
// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) =>{
});

// =================
//   LOGOUT ROUTE
// =================
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "You have been logged out");
    res.redirect('/campgrounds');
});



module.exports = router;