 const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
 
 const User = require("../models/userModel");
const logger = require("../config/logger");

// ─── Helper: Find or create OAuth user  
const findOrCreateOAuthUser = async ({ provider, providerId, email, fullName, avatar }) => {
  // 1. Find by provider ID
  const providerField = `${provider}Id`;
  let user = await User.findOne({ [providerField]: providerId });
  if (user) return user;

  // 2. Find by email (link accounts)
  user = await User.findOne({ email });
  if (user) {
    user[providerField] = providerId;
    user.authProvider = provider;
    if (!user.avatar && avatar) user.avatar = avatar;
    await user.save({ validateBeforeSave: false });
    return user;
  }

  // 3. Create new user
  user = await User.create({
    fullName,
    email,
    [providerField]: providerId,
    authProvider: provider,
    avatar,
    isVerified: true, // OAuth emails are pre-verified
    role: "client",
  });

  return user;
};

// ─── Google Strategy  
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value || null,
        });
        return done(null, user);
      } catch (error) {
        logger.error(`Google OAuth error: ${error.message}`);
        return done(error, null);
      }
    }
  )
);

// ─── Facebook Strategy  
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `fb_${profile.id}@nadif.com`;

        const user = await findOrCreateOAuthUser({
          provider: "facebook",
          providerId: profile.id,
          email,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value || null,
        });
        return done(null, user);
      } catch (error) {
        logger.error(`Facebook OAuth error: ${error.message}`);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
