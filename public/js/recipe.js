/* eslint-disable prefer-arrow-callback */
$(document).ready(() => {
  //This will need to be moved to a .env file before deployment but it is fine here for now
  const apiKey = "230dda3c6fb740ea96eeebc2cc682653";

  //Hide recipe container on page load
  $("#recipe-results").hide();
  $("#recipe-container").hide();

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
      data.results.forEach(recipe => {
        $("#recipes-list").append(
          `<li data-id=${recipe.id} class="recipe-option">${recipe.title}</li>`
        );
      });
    });
  });

  //This call will be triggered when the user hits the button in a search bar form
  $(document).on("click", ".recipe-option", function(e) {
    e.preventDefault;
    $("#recipe-results").hide();
    $("#recipe-container").show();
    recipeId = $(this).data("id");
    console.log(recipeId);
    $.ajax({
      type: "GET",
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=false`
    }).then(data => {
      data.extendedIngredients.forEach(ingredient => {
        $("#ingredient-list").append(
          `<li data-id=${ingredient.id} class="ingredient-item">${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.originalName}</li>`
        );
      });
      $(".recipe-name").text(data.title);
      $("#instructions").append(data.instructions);
    });
  });
});
