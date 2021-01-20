// Requiring path to so we can use relative routes to our HTML files

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("members");
    }
    res.render("login", { title: "Login" });
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("/members");
    }
    res.render("signup", { title: "Sign Up" });
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.render("members", { title: "Shopping List" });
  });

  //Route to the recipe page if user is authenticated
  app.get("/recipe", isAuthenticated, (req, res) => {
    res.render("recipe", { title: "View Recipe" });
  });
};
