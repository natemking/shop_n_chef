/* eslint-disable prefer-arrow-callback */
import { getUserData } from "./getuserdata.js";

$(document).ready(() => {
  //*** Global variables ***//
  //========================//

  //Text value of the searched for recipe from members.html
  const passedRecipe = location.search.replace("?", "");
  //Storage variable for signed in users data
  let userData;
  //Storage variables for later AJAX calls
  let recipeApiId;
  let recipeName;

  //Function to make the ajax call to spoonacular to get a list of recipes that match the user search terms
  const recipeSearch = text => {
    $.ajax({
      type: "GET",
      url: `/api/get_recipes/${text}`
    }).then(data => {
      //Display the results to the DOM
      //If there are no results
      if (data.results.length === 0) {
        $("#recipe-results").show();
        $("#recipes-list").empty();
        $("#recipes-list").append(
          `<p>OH NO! We couldn't find any recipes. Please try again</p>`
        );
        //If there are results
      } else {
        $("#recipe-results").show();
        $("#recipes-list").empty();
        data.results.forEach(recipe => {
          $("#recipes-list").append(
            `<li data-id=${recipe.id} class="recipe-option">${recipe.title}</li>`
          );
        });
      }
    });
  };

  //Function to make the ajax call to spoonacular to get a the details of the recipe and display on DOM
  const getAndDisplayRecipe = recipeId => {
    //Hide the recipe search results
    $("#recipe-results").hide();
    //Show the recipe container
    $("#recipe-container").show();
    $("#directions-container").show();
    //If there has already been a recipe chosen, clear out that DOM
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
      url: `/api/get_recipe/${recipeId}`
    }).then(data => {
      //ForEach loop to add the recipe ingredients to the DOM
      data.extendedIngredients.forEach(ingredient => {
        $("#ingredient-list").append(
          `<li data-id=${ingredient.id} class="ingredient-item">
            ${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort}
            <span id="ingredient-text" data-name="${ingredient.name}">
              ${ingredient.originalName}
            </span>
            <span id="add-item" class="no-check">
              <i class="fa fa-check" aria-hidden="true"></i>
            </span>
          </li>`
        );
      });
      //Add recipe name to DOM
      $(".recipe-name")
        .html(
          `${data.title} <button id="fave-btn" type="button" class="btn btn-danger"><i class="fa fa-heart" aria-hidden="true"></i></button>`
        )
        .css("background-color", "#FDBB46");
      // Add recipe image to DOM
      $("#recipe-image").append(
        `<img src=${data.image} alt="picture of recipe" />`
      );
      //Add recipe instructions to the DOM
      $("#instructions").append(data.instructions);
      //Set global variables with results data
      recipeApiId = recipeId;
      recipeName = data.title;
    });
  };

  //*** On Page Load ***//
  //====================//

  (async () => {
    //Get logged in users user data (email/id)
    const results = await getUserData();

    //Hide recipe container on page load
    $("#recipe-container").hide();
    $("#directions-container").hide();

    //On page load, if the url parameter is a word, search for recipe options otherwise if the parameter is a recipe ID, search for that exact recipe
    passedRecipe.match(/^[a-z]/gi)
      ? recipeSearch(passedRecipe)
      : getAndDisplayRecipe(passedRecipe);

    //Send user data up to global scope
    userData = results;
  })();

  //*** Event Listeners ***//
  //=======================//

  //Search for a list of recipes from the navbar
  $("#search").on("submit", function(e) {
    e.preventDefault();
    $("#recipe-container").hide();
    $("#directions-container").hide();
    $(".recipe-name")
      .empty()
      .css("background-color", "transparent");
    const $searchText = $("#search-text")
      .val()
      .trim();
    recipeSearch($searchText);
  });

  //Display the details of a recipe when a user clicks on the recipe name
  $(document).on("click", ".recipe-option", function(e) {
    e.preventDefault();
    //Recipe id for the API call
    const recipeId = $(this).data("id");
    getAndDisplayRecipe(recipeId);
  });

  //On favorite button click, save recipe to the DB
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
    alert(`${recipeName} has been saved to your favorites`);
  });

  //On click of an ingredient name, send that ingredient to the shopping list and add a check mark next to it.
  $(document).on("click", "#ingredient-text", function(e) {
    e.preventDefault();
    //Get this items name
    const itemName = $(this).data("name");
    //Toggle checkmark if user adds ingredients
    $(this)
      .next()
      .toggleClass("check");
    //Post ingredient to shopping list
    $.ajax({
      type: "POST",
      url: "/api/items",
      data: {
        item_name: itemName
      }
    });
  });
});
