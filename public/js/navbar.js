import { getUserData } from "./getuserdata.js";

$(document).ready(() => {
  (async () => {
    try {
      //Assign the user data to a variable
      const userData = await getUserData();
      //Get the users saved recipes and add them to the saved recipes dropdown
      $.get("api/recipes").then(results => {
        results.forEach(recipe => {
          if (recipe.UserId === userData.id) {
            $(".dropdown-menu").append(
              `<div>
              <div class="d-flex justify-content-between">
                    <a class="dropdown-item" id=${recipe.recipe_api_id} href="/recipe?${recipe.recipe_api_id}">
                        ${recipe.recipe_name}
                    </a>
                    <span>
                        <i class="fa fa-times pr-1 delete-saved" aria-hidden="true" data-db-id=${recipe.id}></i>
                    </span>
                </div>
                <div class="dropdown-divider"></div>
                </div>`
            );
          }
        });
      });
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  })();

  //Delete a saved recipe
  $(document).on("click", ".delete-saved", function() {
    const dbId = $(this).data("db-id");
    $.ajax({
      type: "DELETE",
      url: `/api/recipes/${dbId}`
    }).then(() => {
      $(this)
        .parent()
        .parent()
        .siblings()
        .remove();
      $(this)
        .parent()
        .parent()
        .remove();
    });
  });
});
