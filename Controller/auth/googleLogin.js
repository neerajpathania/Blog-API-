// googleRoutes.js
const express = require('express');
const passport = require('../passport/passportController'); // Adjust the path as necessary
const router = express.Router();

// Google login route
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google callback route
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const { user, token } = req.user;
    // res.json({ user, token });
    res.redirect(`http://localhost:5173/oauth/callback?token=${token}&userId=${user._id}`);

});

module.exports = router;
