console.log("...fetching a random cocktail 🍹");


const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const ingredientsList = document.querySelector(".ingredients");
const glassInfo = document.querySelector(".glass-info");
const likeButton = document.querySelector(".like-button");

function saveFavorite(drink) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || '[]');
  favorites.push(drink);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeFavorite(drinkId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites = favorites.filter(drink => drink.idDrink !== drinkId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(drinkId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return favorites.some(drink => drink.idDrink === drinkId);
}

function updateLikeButton(drinkId) {
  const isFav = isFavorite(drinkId);
  const icon = likeButton.querySelector('.material-symbols-outlined');
  
  if (isFav) {
    likeButton.classList.add('liked');
    icon.style.fontVariationSettings = "'FILL' 1"; 
  } else {
    likeButton.classList.remove('liked');
    icon.style.fontVariationSettings = "'FILL' 0"; 
  }
}

fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")

//fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=rum%20punch")
  .then((response) => response.json())
  .then((data) => {
    const drink = data.drinks[0];
    console.log("drink: ", drink);

    // display title in title container
    titleContainer.innerHTML = drink.strDrink;

    // display drink image
    const img = document.createElement("img");
    img.src = drink.strDrinkThumb;
    img.alt = drink.strDrink;
    imgContainer.appendChild(img);

    // display ingredients
    console.log("Starting to process ingredients...");
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      
      if (ingredient) {
        const li = document.createElement("li");
        li.textContent = `${measure ? measure.trim() : ''} ${ingredient}`;
        ingredientsList.appendChild(li);
      }
    }
    
    glassInfo.textContent = ` ${drink.strGlass}`;

    updateLikeButton(drink.idDrink);

    likeButton.addEventListener('click', () => {
      if (isFavorite(drink.idDrink)) {
        removeFavorite(drink.idDrink);
      } else {
        saveFavorite(drink);
      }
      updateLikeButton(drink.idDrink);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
