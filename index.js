const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '573749253955-qvf8fpa93h9ad02o172ugb29l218ff63.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'HotQVhpAg0AJK3jOXlBA1ust';
 
app.set('view engine', 'ejs');
 
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
 
app.get('/', function(req, res) {
    res.render('login');
});
 
var userProfile;
 
app.use(passport.initialize());
app.use(passport.session());
 
app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));
 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
 
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
  
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
  
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
 
const port = process.env.PORT || 3500;
app.listen(port , () => console.log('App listening on port ' + port));
