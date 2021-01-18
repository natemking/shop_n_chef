// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", async (req, res) => {
    try {
      await db.User.create({
        email: req.body.email,
        password: req.body.password
      });
      res.redirect(307, "/api/login");
    } catch (err) {
      res.status(401).json(err);
    }
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //Routes for GET, POST, PUT, & DELETE shopping list items
  app
    .route("/api/items/:id?")
    .get(async (req, res) => {
      if (!req.user) {
        res.json({});
      } else {
        const items = await db.Item.findAll({ where: { UserId: req.user.id } });
        res.json(items);
      }
    })
    .post(async (req, res) => {
      try {
        await db.Item.create({
          item_name: req.body.item_name,
          UserId: req.user.id
        });
        res.status(201).end();
      } catch (err) {
        res.status(403).json(err);
      }
    })
    .put(async (req, res) => {
      try {
        await db.Item.update(
          { item_name: req.body.item_name },
          { where: { id: req.body.id } }
        );
        res.status(202).end();
      } catch (err) {
        res.status(403).json(err);
      }
    })
    .delete(async (req, res) => {
      try {
        await db.Item.destroy({ where: { id: req.params.id } });
        res.status(202).end();
      } catch (err) {
        res.status(404).json(err);
      }
    });

  //Routes for GET, POST, & DELETE recipes
  app
    .route("/api/recipes/:id?")
    .get(async (req, res) => {
      if (!req.user) {
        res.json({});
      } else {
        const recipes = await db.Recipe.finAll({
          where: { UserId: req.user.id }
        });
        res.json(recipes);
      }
    })
    .post(async (req, res) => {
      try {
        console.log(req.body);
        await db.Recipe.create({
          UserId: req.body.user_id,
          recipe_name: req.body.recipe_name,
          recipe_api_id: req.body.recipe_api_id
        });
      } catch (error) {
        res.status(403).json(err);
      }
    })
    .delete(async (req, res) => {
      try {
        await db.Item.destroy({ where: { id: req.params.id } });
        res.status(202).end();
      } catch (err) {
        res.status(404).json(err);
      }
    });
};
