// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");

module.exports = function(app) {
  //*** Local API authentication ***//
  //================================//
  // If the user has valid login credentials, send them to the members page,  Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  //Route use to sign up page. PW is hashed before it hits the DB
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

  //*** 3rd party API calls***//
  //==========================//
  //Route to get a list recipes data from spoonacular for the frontend
  app.get("/api/get_recipes/:text", (req, res) => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=${req.params.text}&instructionsRequired=true`
      )
      .then(response => {
        res.json(response.data);
      });
  });

  //Route to get a chosen recipes data from spoonacular for the frontend
  app.get("/api/get_recipe/:id", (req, res) => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`
      )
      .then(response => {
        res.json(response.data);
      });
  });

  //*** Local API call to DB ***//
  //============================//
  //Routes for GET, POST, PUT, & DELETE single shopping list items
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

  //Delete all shopping list items
  app.delete("/api/list_destroy/:userid", async (req, res) => {
    try {
      await db.Item.destroy({ where: { UserId: req.params.userid } });
      res.status(202).end();
    } catch (err) {
      res.status(404).json(err);
    }
  });

  //Routes for GET, POST, & DELETE recipes. Delete is for a saved recipe
  app
    .route("/api/recipes/:id?")
    .get(async (req, res) => {
      if (!req.user) {
        res.json({});
      } else {
        const recipes = await db.Recipe.findAll({
          where: { UserId: req.user.id }
        });
        res.json(recipes);
      }
    })
    .post(async (req, res) => {
      try {
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
        await db.Recipe.destroy({ where: { id: req.params.id } });
        res.status(202).end();
      } catch (err) {
        res.status(404).json(err);
      }
    });
};
