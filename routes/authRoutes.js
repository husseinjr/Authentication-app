const { Router } = require("express");
const authControllers = require("../controllers/authControllers");
const session = require("express-session");
const passport = require("passport");
const initialize = require("../passportConfig");

const router = Router();
// use middlewares
initialize(passport);
router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());


// get requests
router.get("/register", checkAuth, authControllers.register_get);
router.get("/login", checkAuth, authControllers.login_get);
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You have logged out successfully");
    res.redirect("/users/login");
  });
});
router.get("/dashboard", checkNotAuth, (req, res) => {
  res.render("dash", { user: req.user.name });
});


// post requests
router.post("/register", authControllers.register_post);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);



// middleware functions

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  return next();
}

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/users/login");
}

// export routers
module.exports = router;
