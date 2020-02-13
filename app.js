var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var Game = require("./models/game");
var Comment = require("./models/comment");
var User = require ("./models/user");
var seedDB = require("./seeds")

//requiring routes
var commentRoutes = require("./routes/comments");
var gameRoutes = require("./routes/games");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://KingOozma:Animalcrossingworld94!@cluster0-dm98z.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Nike wins cutest dog!",
	resave: false,
	saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/games/:id/comments", commentRoutes);
app.use("/games", gameRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.log("The YelpGaming Server Has Started!");
});