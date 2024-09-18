// passportConfig.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserRegister = require("../../model/auth/register");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;

    // Check if user already exists
    let user = await UserRegister.findOne({ googleId: id });
    if (!user) {
        // Create a new user if not exists
        user = new UserRegister({
            googleId: id,
            name: displayName,
            email: emails[0].value
        });
        await user.save();
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    done(null, { user, token });
}));

// Serialize user (for sessions)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
