/* eslint-disable prefer-arrow-callback */
$(document).ready(() => {
  //Storage variable for signed in users email and id data
  let userData;

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page and updates the userData variable
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    userData = data;
  });

  //Send the recipe search text to recipe.html
  $("#search").on("submit", function(e) {
    e.preventDefault();
    const $searchText = $("#search-text")
      .val()
      .trim();
    $(location).attr("href", `/recipe?${$searchText}`);
  });

  // Display the items for the signed in user
  // Code here is for testing... To be removed
  $.get("api/items").then(results => {
    results.forEach(item => {
      if (item.UserId === userData.id) {
        $("#shopping-list").append(
          `<li id=${item.id} class="list-group-item list-group-item-action list-group-item-dark">
            <span class"item">${item.item_name}</span>
              <button type="button" class="delete-btn" data-item-id=${item.id}>delete</button>
              <input type='text' class='edit' style='display: none;'>
          </li>`
        );
      }
    });
  });

  //Send added item to the backend to be added to Items table
  $("#add-item").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/items",
      data: {
        item_name: $("#item-name-text")
          .val()
          .trim()
      }
    }).then(() => {
      location.reload();
    });
  });

  //Event listener for editing item. When clicked the value turns into a text input box
  $(document).on("click", ".item", function() {
    const currentItem = $(this)
      .text()
      .trim();
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(currentItem);
    $(this)
      .children("input.edit")
      .show();
    $(this)
      .children("input.edit")
      .focus();
  });

  //Hit enter key to post new item name
  $(document).on("keyup", ".item", function(e) {
    e.preventDefault();
    if (e.which === 13) {
      const editedItem = $(this)
        .children("input")
        .val()
        .trim();
      $(this).blur();
      $.ajax({
        type: "PUT",
        url: "api/items",
        data: {
          item_name: editedItem,
          id: $(this).attr("id")
        }
      }).then(() => {
        location.reload();
      });
    }
  });

  $(document).on("click", ".delete-btn", function(e) {
    e.preventDefault;
    const id = $(this).data("item-id");
    $.ajax({
      type: "DELETE",
      url: `/api/items/${id}`
    }).then(() => {
      location.reload();
    });
  });
});
