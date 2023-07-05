const inputButton = document.getElementById("search_box");

const suggestion_box = document.getElementById("suggestion");

const list = document.getElementById("list");

const container = document.getElementById("container");

const new_container = document.getElementById("new_container");

const favorite_list = document.getElementById("fav-list");

const nav = document.getElementById("nav");

const fav_container = document.getElementById("favorite_list");

let fav = [];
let fav_list = JSON.parse(localStorage.getItem('favListArr'));

// get item for localStorage
if (localStorage.getItem('favListArr') == null) {
  fav_list = [];
  render()
}

let istoggle=true;
let meals_data = "";

let mealString = "";

// search box function
handlechange = (e) => {

  let mealName = e.target.value;
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
  async function fetchURL(url) {
    let response = await fetch(url);
    let data = await response.json();
    meals_data = data;
    mealString = e.target.value;
    if (mealString.length > 0) {
      addSuggestionList(data.meals);
    }
    displayList(data.meals);
  }
  fetchURL(url);
};
// display suggestion list
function addSuggestionList(meals) {
  suggestion_box.innerHTML = "";
  for (let i = 0; i < meals.length && i < 5; i++) {
    const li = document.createElement("li");
    li.setAttribute("class", "seggestion_box");
   
    li.innerHTML = `
      <div  class="pro_name_sugg"  onclick="suggClick(${meals[i].idMeal})">${meals[i].strMeal}</div>
      `;
    suggestion_box.append(li);
  }
}
suggClick = (e) => {
  showMealsDetails(e);
};

// display the  list
function addlistToDom(meals) {
  const li = document.createElement("li");
  li.setAttribute("class", "list_box");
  li.innerHTML = `
  <div id="zoom_In">
   <figure>
    <img class="list_img" alt="img" src="${meals.strMealThumb}"/>
   </figure>
  </div>
<div class="product_name">${meals.strMeal}</div>

<div id="details">
    <button id= "${Date.now()}" onclick="showMealsDetails(${
    meals.idMeal
  })">Recipe </button>
    <img alt="img" id="fav-Btn" onclick="addFavList(${
      meals.idMeal
    })" src="https://media.istockphoto.com/id/1305618081/vector/vector-illustration-of-like-icon.jpg?s=170667a&w=0&k=20&c=ue54HPlGPQ0OJqG8yxtFTqGG-l_i_LzD_uBX5BEEPHA="/>
</div>
`;
  list.append(li);
  showMealsDetails = (mealId) => {
    for (let i = 0; i < meals_data.meals.length; i++) {
      if (mealId == meals_data.meals[i].idMeal) {
        new_container.innerHTML = "";
        container.style.display = "none";
        new_container.style.display = "block";
        fav_container.style.display = "none";
        nav.style.display = "flex";
        const div = document.createElement("div");
        div.setAttribute("class", "Product_details_container");
        div.innerHTML = `
        
          <div id="left_desc">
          <div id="meal-img">
            <img src="${meals_data.meals[i].strMealThumb}" alt="img"/>
          </div>
          <div id="food-desc">
          <div id="type">Type:
          <span id="meal-type">${meals_data.meals[i].strArea}</span>
          </div>
          <div id="ingredients">Ingredients:
           <span id="ingredients-type">
            ${meals_data.meals[i].strIngredient1},
            ${meals_data.meals[i].strIngredient2},
            ${meals_data.meals[i].strIngredient3},
            ${meals_data.meals[i].strIngredient4},
            ${meals_data.meals[i].strIngredient4},
            ${meals_data.meals[i].strIngredient5},
            ${meals_data.meals[i].strIngredient6}
           </span>
          </div>
          </div>
          </div>
          <div id="right_desc">
          <div id="meal-heading">${meals_data.meals[i].strMeal}</div>
          <div class="meal-desc-buttons">
          <div id="wat-vid" class="meal-btn">
           <a href="${meals_data.meals[i].strYoutube}">Watch Recipe</a>
          </div>
          <div class="meal-btn add-to-fav" onclick="addFavList(${meals_data.meals[i].idMeal})">${istoggle ?"Add to Favourite":"Remove to Favourite"}</div>
          </div>
          <div id="recipe">${meals_data.meals[i].strInstructions}</div>
          </div>
          `;
        new_container.append(div);
        return;
      }
    }
  };
}
// add item to favorite list
function addFavList(e){
  istoggle=!istoggle;
  if(fav_list.length==0){
    fav_list.push(e);
    alert('push data fav_list')
    return;
  }
  for(let i=0;i<fav_list.length;i++){
    if(fav_list[i]==e){
        fav_list.splice(i, 1);
    alert('pop data fav_list')
      return;
    }
  }  
  fav_list.push(e)
  alert('push data fav_list')
}

// set favorite item to localstorage
 function render(){
  localStorage.setItem('favListArr', JSON.stringify(fav_list));
  for(let id of fav_list){
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  
    async function fetchURL(url) {
      let response = await fetch(url);
      let data = await response.json();
     let favMealData = data.meals
     addToDom(favMealData);
    }
    fetchURL(url); 
  }
}
// favorite list function 
favorite = () => {
  fav_container.style.display = "block";
  container.style.display = "none";
  new_container.style.display = "none";
  nav.style.display = "none";
favorite_list.innerHTML = '';
render();
}

// display the favorite list

function addToDom(favMealData){
   
  const li = document.createElement("li");
        li.setAttribute("class", "fav-list-item");
        li.innerHTML = `
    <img class="img" alt="img" src="${favMealData[0].strMealThumb}"/>
    <div class="cart-details">
     <div class="cart-heading">${favMealData[0].strMeal}</div>
     <div class="fav-cart-Btn">
      <div class="recipe card-btn" data-mealid="${favMealData[0].idMeal}" onclick="showMealsDetails(${favMealData[0].idMeal})"> 
      See Recepie </div>
      <div class="fav-remove-btn card-btn" onclick="remFavList(${favMealData[0].idMeal})">Remove from Favorite</div>
    </div>
    `;
        favorite_list.append(li); 
}
//this function is used to remove item in favorite list

function remFavList(id){
  for(let i=0;i<fav_list.length;i++){
    if(fav_list[i]==id){
      fav_list.splice(i, 1);
  localStorage.setItem('favListArr', JSON.stringify(fav_list));
      alert('pop the favlist');
      favorite();
    }
  }
}
// closs favorite list
clossFav = () => {
  fav_container.style.display = "none";
  container.style.display = "block";

  nav.style.display = "flex";
};

// display the list of  
function displayList(meals) {
  list.innerHTML = "";
  for (let i = 0; i < meals.length; i++) {
    addlistToDom(meals[i]);
  }
}
// open the home page
home = () => {
  new_container.style.display = "none";
  container.style.display = "block";
};

inputButton.addEventListener("keyup", handlechange);


