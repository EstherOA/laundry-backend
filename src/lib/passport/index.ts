const StaffService = require("../../services/StaffService");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

module.exports = (config: any) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "phoneNumber",
        passwordField: "password",
      },
      async (phoneNumber: any, password: any, done: any) => {
        try {
          const staff = await StaffService.findByPhoneNumber(phoneNumber);
          if (!staff) {
            return done(null, false, { message: "Invalid Login Details" });
          }
          const isMatch = await staff.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid Login Details" });
          }
          return done(null, staff);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET,
      },
      async (jwtPayload: any, done: any) => {
        console.log("jwt:", jwtPayload);

        try {
          const user = await StaffService.getOne(jwtPayload.userId);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((staff: any, done: any) => {
    done(null, staff.id);
  });

  passport.deserializeUser(async (id: any, done: any) => {
    try {
      const staff = await StaffService.getOne(id);
      return done(null, staff);
    } catch (err) {
      return done(err);
    }
  });
  return passport;
};
