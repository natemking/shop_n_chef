/* eslint-disable prefer-arrow-callback */
import { getUserData } from "./getuserdata.js";

$(document).ready(() => {
  //*** Global variables ***//
  //========================//

  //Storage variable for signed in users data
  let userData;

  //Function to dynamically add items to the shopping list
  const addToList = (id, itemName) => {
    $("#shopping-list").append(
      `<li class="list-group-item list-group-item-dark d-flex flex-row justify-content-between">
            <button type="button" class="check-btn btn btn-success" data-item-id=${id}>
              <i class="fa fa-check" aria-hidden="true"></i>
            </button>
            <span id=${id} class="item no-strike">${itemName}</span>
            <button type="button" class="delete-btn btn btn-danger" data-item-id=${id}>
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </li>`
    );
  };

  //*** On Page Load ***//
  //====================//
  (async () => {
    //Get logged in users user data (email/id)
    const userResults = await getUserData();

    // Display the items for the signed in user
    $.get("api/items").then(results => {
      results.forEach(item => {
        if (item.UserId === userData.id) {
          addToList(item.id, item.item_name);
        }
      });
      //Show the delete all button if there are any items in the list
      $("#shopping-list").children().length > 0
        ? $("#delete-all-btn").show()
        : $("#delete-all-btn").hide();
    });

    //Send user data up to global scope
    userData = userResults;
  })();

  //*** Event Listeners ***//
  //=======================//

  //Send the recipe search text to recipe.html
  $("#search").on("submit", function(e) {
    e.preventDefault();
    const $searchText = $("#search-text")
      .val()
      .trim();
    $(location).attr("href", `/recipe?${$searchText}`);
  });

  //On add item submission, add the item to the DB
  $("#add-item").on("submit", function(e) {
    e.preventDefault();
    //Set the users item name to a variable
    const itemName = $("#item-name-text")
      .val()
      .trim();
    //Clear the input text field
    $("#item-name-text").val("");

    //AJAX call to post item to DB
    $.ajax({
      type: "POST",
      url: "/api/items",
      data: {
        item_name: itemName
      }
    }).then(() => {
      //Get the newly posted item and add to the shopping list dynamically
      $.get("api/items").then(results => {
        results.forEach(item => {
          if (item.item_name === itemName) {
            addToList(item.id, item.item_name);
          }
        });
      });
    });
  });

  //Cross-off item
  //If checkbox is clicked, strikethrough is toggled on the item
  $(document).on("click", ".check-btn", function(e) {
    e.preventDefault();
    $(this)
      .next()
      .toggleClass("strike");
  });

  //Edit item
  //When item is clicked it becomes a text input for editing
  $(document).on("click", ".item", function() {
    const currentItem = $(this)
      .text()
      .trim();
    $(this).wrap(`<input type="text" class="edit" />`);
    $("input.edit")
      .val(currentItem)
      .focus();
  });

  //Cancel item edit
  //When clicking anywhere the item is no longer editable
  $(document).on("blur", "input.edit", function() {
    $(this)
      .find(".item")
      .unwrap();
  });

  //Save item edit
  //Hit enter key to post new, edited item name
  $(document).on("keyup", "input.edit", function(e) {
    e.preventDefault();
    //If enter key is hit
    if (e.which === 13) {
      //Variable for the new item data
      const editedItem = $(this)
        .val()
        .trim();
      //Variable for the items DB ID
      const itemId = $(this)
        .find("span")
        .attr("id");
      //Add the edited item into its span container
      $(this)
        .find("span")
        .text(editedItem);
      //Remove focus from the item
      $(this).blur();
      //Send the edited item value and its DB ID to the backend
      $.ajax({
        type: "PUT",
        url: "/api/items",
        data: {
          item_name: editedItem,
          id: itemId
        }
      }).then(err => {
        if (err) {
          throw err;
        }
      });
    }
  });

  //Delete an item
  //When x button is clicked item is deleted in the DB and dynamically removed from the list
  $(document).on("click", ".delete-btn", function(e) {
    e.preventDefault();
    const id = $(this).data("item-id");
    $.ajax({
      type: "DELETE",
      url: `/api/items/${id}`
    }).then(() => {
      this.closest("li").remove();
    });
  });

  //Delete all items
  $("#delete-all-btn").on("click", function(e) {
    e.preventDefault();
    $.ajax({
      type: "DELETE",
      url: `/api/list_destroy/${userData.id}`
    }).then(() => {
      location.reload();
    });
  });
});
