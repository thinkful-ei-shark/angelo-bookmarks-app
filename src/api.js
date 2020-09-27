const BASE_URL = 'https://thinkful-list-api.herokuapp.com/angelovazquez/bookmarks';

const getItems = function(){
  console.log("get-items")
  return fetch(BASE_URL)
  .then(response => response.json())
  // .then(data=> data)
  // return Promise.resolve('A successful response');
  // return fetch()
  //       
  //       .then(data => console.log("fetch-ajax-api"));
}

const createItem = function(bookmark){
  const newBookmark = JSON.stringify(bookmark);
  return fetch(BASE_URL, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: newBookmark,
  })

}

const deleteItem = function(id){
  return fetch(BASE_URL + "/" + id,{  
    method:'DELETE',
  });
  
};

  export default {
    getItems,
    createItem,
    deleteItem,
  };