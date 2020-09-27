//Insert Render function, toggle, clicked,

import $ from "jquery";
import store from "./store";

//this manipulates data from the server through a request
import api from "./api";

const generateHtmlString = function () {
  return `<header>
    <label for="heading"></label>
    <div id="main" class="container">
       <h2>Bookmark it!</h2>
        <form id="bookmark-container">
        <fieldset>
        <label for="bookmark-input">Bookmark:<br></label>
        <input id="bookmark-input" type="text" placeholder="Bookmark Name">
        <div id="url-container">
        <label for="address-input">Address:<br></label>
        <input id="address-input" type="text" placeholder="Enter Web address">
        <label for="description-input"><br>Description:</br>
        <input id="description-input" type="text" placeholder="Enter Notes" value="">
        <label for="rating-btn"><br>Rating:<br></label>
        
        <input type="radio" name="rate" id="rate-1" value="1" >1
        <label for="rate-5" class="rate-btn"></label>
        <input type="radio" name="rate" id="rate-2" value="2">2
        <label for="rate-5" class="rate-btn"></label>
        <input type="radio" name="rate" id="rate-3" value="3">3
        <label for="rate-5" class="rate-btn"></label>
        <input type="radio" name="rate" id="rate-4" value="4">4
        <label for="rate-5" class="rate-btn"></label>
        <input type="radio" name="rate" id="rate-5" value="5" checked="checked">5
        <label for="rate-5" class="rate-btn"></label>
        <br>
        <input id="add" type="submit" value="Add">
       <!--Dropdown rating button  -->
        <label for="radio-btn"></label>
        <select name="rating">
          <option value = "">Select By Rate</option>
          <option value ="1">1</option>
          <option value ="2">2</option>
          <option value ="3">3</option>
          <option value ="4">4</option>
          <option value ="5">5</option>
          </div>
        </form>

        </select>
      </fieldset>
        <br>
    </div>`;
};

const addbtn = function () {
  $("main").on("submit", "#bookmark-container", function (e) {
    e.preventDefault();
    let title = $("#bookmark-input").val();
    let url = $("#address-input").val();
    // create description box within "filter by"
    let desc = $("#description-input").val();
    let rating = $("input[name = 'rate']:checked").val();
    console.log(title, url, rating, desc);
    $("#bookmark-input").val("");
    $("#address-input").val("");
    const bookmark = { title: title, url: url, desc: desc, rating: rating };

    api
      .createItem(bookmark)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        store.addBookmark(data);
        render();
      });
  });
};

const handleDelete = function () {
  $("main").on("click", ".delete", function (e) {
    let id = $(e.currentTarget).closest(".bookmark").attr("id");
    api
      .deleteItem(id)
      .then((res) => res.json())
      .then(() => {
        store.deleteBookmark(id);
        render();
      });
  });
};

const filterBy = function () {
  $("main").on("click", "select", function () {
    const rating = $("select").val();
    if (rating) {
      store.filter = rating;
      $("select").val("");
      render();
    }
  });
};

const render = function () {
  let page = generateHtmlString();
  page += generateBookmarkList();
  $("main").html(page);
};

//take bookmarks from the store and make list items
//create bookmarks container in html form above
const generateBookmarkList = function () {
  let bookmarks = [...store.bookmarks];
  const bookmarksString = generateBookmarkString(bookmarks);
  return bookmarksString;
};

const generateBookmarkString = function (bookmarks) {
  let bookmarkList = bookmarks.map((bookmark) => {
    if (bookmark.rating >= store.filter) {
      if (bookmark.expanded === false) {
        return `
   <div id="${bookmark.id}" class="bookmark">
    <span class="title">${bookmark.title}</span>
    <span class="rating">${bookmark.rating}</span>
    </div>
    `;
      } else {
        return `
      <div id=${bookmark.id} class="bookmark">
        <div class="header-1">
          <span class="title">${bookmark.title}</span>
          <span><button class="delete">Delete</button></span>
        </div>
        <div class="header-2">
          <span class="url"><a href="${bookmark.url}" class="visit">Visit Site</a></span>
          <span class="rating">Rating: ${bookmark.rating}</span>
        </div>
        <div class="desc">${bookmark.desc}
        </div>
      </div>
      `;
      }
    } else {
      return "";
    }
  });

  return `
  <fieldset class="bookmark-list">
  ${bookmarkList.join("")}
  </fieldset>
  `;
};

//This function handles the action of the bookmark expand field
function handleExpand() {
  $("main").on("click", ".bookmark", function (e) {
    let id = e.currentTarget.id;
    console.log(id);
    let bookmark = store.findById(id);
    bookmark.expanded = !bookmark.expanded;

    render();
  });
}
const bindEvenListeners = function () {
  addbtn();
  handleExpand();
  handleDelete();
  filterBy();
};

//export functions to index.js
export default {
  render,
  bindEvenListeners,
};

//generate form page