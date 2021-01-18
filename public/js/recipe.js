/* eslint-disable prefer-arrow-callback */
$(document).ready(() => {
  //*** Global variables ***//
  //========================//
  //This will need to be moved to a .env file before deployment but it is fine here for now
  const apiKey = "230dda3c6fb740ea96eeebc2cc682653";
  //Text value of the searched for recipe from members.html
  const passedRecipe = location.search.replace("?", "");
  //Storage variable for user data
  let userData;
  //storage variables for later AJAX calls
  let recipeApiId;
  let recipeName;

  //Function to make the ajax call to spoonacular to get a list of recipes that match the user search terms
  const apiSearch = text => {
    $.ajax({
      type: "GET",
      url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${text}&instructionsRequired=true`
    }).then(data => {
      //display the results to a DOM element
      $("#recipe-results").show();
      // jQuery.empty() syntax will clear out each search result as user inputs different ingredients
      $("#recipes-list").empty();
      data.results.forEach(recipe => {
        $("#recipes-list").append(
          `<li data-id=${recipe.id} class="recipe-option">${recipe.title}</li>`
        );
      });
    });
  };

  //*** After Page Load ***//
  //=======================//

  //Get logged in users user data (email/id)
  $.get("/api/user_data").then(data => {
    userData = data;
    return userData;
  });

  //Hide recipe container on page load
  $("#recipe-results").hide();
  $("#recipe-container").hide();

  //On page load search
  apiSearch(passedRecipe);

  //Search if user uses search feature in the navbar
  $("#search").on("submit", function(e) {
    e.preventDefault();
    $("#recipe-container").hide();
    $(".recipe-name").empty();
    const $searchText = $("#search-text")
      .val()
      .trim();
    apiSearch($searchText);
  });

  //This call will be triggered when the user clicks on a recipe provide from the initial search results.
  $(document).on("click", ".recipe-option", function(e) {
    e.preventDefault();
    //Recipe id for the API call
    recipeId = $(this).data("id");
    //Hide the recipe search results
    $("#recipe-results").hide();
    //Show the recipe container
    $("#recipe-container").show();

    //If there has already been a recipe chosen, clear out that data
    if (
      $("#ingredient-list").children().length > 0 ||
      $("#instructions").children().length > 0
    ) {
      $("#ingredient-list").empty();
      $("#instructions").empty();
      $("#recipe-image").empty();
    }

    //AJAX call to get the recipe data
    $.ajax({
      type: "GET",
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=false`
    }).then(data => {
      //ForEach loop to add the recipe ingredients to the DOM
      data.extendedIngredients.forEach(ingredient => {
        $("#ingredient-list").append(
          `<li data-id=${ingredient.id} class="ingredient-item">${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.originalName}<button id="addIngredient-btn" type="button" class="btn btn-outline-dark"><i class="fa fa-plus" aria-hidden="true"></i></li>`
        );
      });
      //Add recipe name to DOM
      $(".recipe-name").html(
        `${data.title} <button id="fave-btn" type="button" class="btn btn-danger"><i class="fa fa-heart" aria-hidden="true"></i></button>`
      );
      // add recipe image to DOM
      $("#recipe-image").append(
        `<img src=${data.image} alt="picture of recipe" />`
      );
      //Add recipe instructions to the DOM
      $("#instructions").append(data.instructions);
      recipeApiId = recipeId;
      recipeName = data.title;
    });
  });

  //On click of favorite button in recipe name header, send the recipe name and its ID from the spoonacular API to the DB
  $(document).on("click", "#fave-btn", function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/recipes",
      data: {
        user_id: userData.id,
        recipe_api_id: recipeApiId,
        recipe_name: recipeName
      }
    });
  });

  //On click of add ingredient button in the recipe, send the ingredient name and its ID from the spoonacular API to the DB
  $(document).on("click", "#addIngredient-btn", function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/items",
      data: {
        user_id: userData.id,
        item_name: itemName
      }
    });
  });
});
