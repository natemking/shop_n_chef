/* eslint-disable prefer-arrow-callback */
$(document).ready(() => {
  //This will need to be moved to a .env file before deployment but it is fine here for now
  const apiKey = "230dda3c6fb740ea96eeebc2cc682653";

  //Hide recipe container on page load
  $("#recipe-results").hide();
  $("#recipe-container").hide();

  let userData;

  $.get("/api/user_data").then(data => {
    userData = data;
    return userData;
  });

  $("#search").on("submit", function(e) {
    e.preventDefault();

    const $searchText = $("#search-text")
      .val()
      .trim();
    $.ajax({
      type: "GET",
      url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${$searchText}&instructionsRequired=true`
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
  });

  //storage variables for later AJAX calls
  let recipeApiId;
  let recipeName;

  //This call will be triggered when the user hits the button in a search bar form
  $(document).on("click", ".recipe-option", function(e) {
    e.preventDefault();
    $("#recipe-results").hide();
    $("#recipe-container").show();
    recipeId = $(this).data("id");
    $.ajax({
      type: "GET",
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=false`
    }).then(data => {
      data.extendedIngredients.forEach(ingredient => {
        $("#ingredient-list").append(
          `<li data-id=${ingredient.id} class="ingredient-item">${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.originalName}</li>`
        );
      });
      $(".search").empty("");
      $(".recipe-name").html(
        `${data.title} <button id="fave-btn" type="button" class="btn btn-danger"><i class="fa fa-heart" aria-hidden="true"></i></button>`
      );
      $("#instructions").append(data.instructions);
      recipeApiId = recipeId;
      recipeName = data.title;
    });
  });

  //On click of favorite button in recipe name header, send the revipe name and its ID from the spoonacular API to the DB
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
});
