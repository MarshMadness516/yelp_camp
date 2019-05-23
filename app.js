const express           = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require('mongoose'),
    flash               = require('connect-flash'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    methodOverride      = require('method-override'),
    Campground          = require('./models/campground'),
    Comment             = require('./models/comment'),
    User                = require('./models/user'),
    seedDB              = require('./seeds');
    
var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

    

// mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
// mongoose.connect('mongodb+srv://mpritchett:marzy596@cluster0-swuvm.mongodb.net/test?retryWrites=true', {
//     useNewUrlParser: true,
//     useCreateIndex: true
// });
let url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// __dirname refers to the entire directory path
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seed the database
// seedDB();

// Passport Configuration
app.use(require('express-session')({
    secret: "It is nice outside",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// functions as middleware on every route
// req.user will only contain data if signed in
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Require routes
// add common route in front of route files
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("YELPCAMP SERVER HAS STARTED")
});