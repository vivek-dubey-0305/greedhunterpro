import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
import { logActivity } from '../utils/logActivity.utils.js';

// Passport session serialization
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/v1/users/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ 'socialLinks.google.id': profile.id });

        if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            await logActivity(user._id, 'login', { method: 'google' });
            return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Link Google account to existing user
            if (!user.socialLinks) {
                user.socialLinks = {};
            }
            user.socialLinks.google = {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile.photos[0].value
            };
            user.lastLogin = new Date();
            await user.save();
            await logActivity(user._id, 'account_link', { provider: 'google' });
            return done(null, user);
        }

        // Create new user
        const newUser = new User({
            username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substr(2, 5),
            email: profile.emails[0].value,
            fullName: profile.displayName,
            avatar: profile.photos[0].value,
            isEmailVerified: true, // Google emails are verified
            socialLinks: {
                google: {
                    id: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    picture: profile.photos[0].value
                }
            },
            lastLogin: new Date()
        });

        await newUser.save();
        await logActivity(newUser._id, 'registration', { method: 'google' });
        return done(null, newUser);

    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/v1/users/auth/github/callback`
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ 'socialLinks.github.id': profile.id });

        if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            await logActivity(user._id, 'login', { method: 'github' });
            return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Link GitHub account to existing user
            if (!user.socialLinks) {
                user.socialLinks = {};
            }
            user.socialLinks.github = {
                id: profile.id,
                username: profile.username,
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0].value
            };
            user.lastLogin = new Date();
            await user.save();
            await logActivity(user._id, 'account_link', { provider: 'github' });
            return done(null, user);
        }

        // Create new user
        const newUser = new User({
            username: profile.username || (profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substr(2, 5)),
            email: profile.emails[0].value,
            fullName: profile.displayName || profile.username,
            avatar: profile.photos[0].value,
            isEmailVerified: true, // GitHub emails are verified
            socialLinks: {
                github: {
                    id: profile.id,
                    username: profile.username,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0].value
                }
            },
            lastLogin: new Date()
        });

        await newUser.save();
        await logActivity(newUser._id, 'registration', { method: 'github' });
        return done(null, newUser);

    } catch (error) {
        console.error('GitHub OAuth error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;