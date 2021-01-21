import { getUserData } from "./getuserdata.js";

//function that dynamically adds saved recipes to the DOM in the navbar dropdown
export const dropDown = (apiId, name, id) => {
  $(".dropdown-menu").append(
    `<div>
        <div class="d-flex justify-content-between">    
        <a class="dropdown-item" id=${apiId} href="/recipe?${apiId}">
             ${name}
            </a>
            <span>
              <i class="fa fa-times pr-1 delete-saved" aria-hidden="true" data-db-id=${id}></i>
            </span>
          </div>
        <div class="dropdown-divider"></div>
      </div>`
  );
};

$(document).ready(() => {
  //*** Navbar Dropdown ***//
  //=======================//

  (async () => {
    try {
      //Assign the user data to a variable
      const userData = await getUserData();
      //Get the users saved recipes and add them to the saved recipes dropdown
      $.get("api/recipes").then(results => {
        results.forEach(recipe => {
          if (recipe.UserId === userData.id) {
            dropDown(recipe.recipe_api_id, recipe.recipe_name, recipe.id);
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
