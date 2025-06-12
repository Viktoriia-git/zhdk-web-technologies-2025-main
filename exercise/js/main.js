console.log("...fetching a random cocktail 🍹");

let currentIndex = 0;
let viewedDrinks = [];

const titleContainer = document.querySelector("[data-js='title']");
const imgContainer = document.querySelector("[data-js='photo']");
const ingredientsList = document.querySelector(".ingredients");
const glassInfo = document.querySelector(".glass-info");
const likeButton = document.querySelector(".like-button");
const nextButton = document.querySelector(".next-button");
const backButton = document.querySelector(".back-button");

function clearDisplay() {
  titleContainer.innerHTML = '';
  imgContainer.innerHTML = '';
  ingredientsList.innerHTML = '';
  glassInfo.textContent = '';
}

function displayDrink(drink){
  clearDisplay();

  titleContainer.innerHTML = drink.strDrink;

  // display drink image
  const img = document.createElement("img");
  img.src = drink.strDrinkThumb;
  img.alt = drink.strDrink;
  imgContainer.appendChild(img);

  // display ingredients
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

  likeButton.onclick = function() {
    console.log('Like button clicked');
    if (isFavorite(drink.idDrink)) {
      removeFavorite(drink.idDrink);
      console.log('Removed from favorites');
    } else {
      saveFavorite(drink);
      console.log('Added to favorites');
    }
    updateLikeButton(drink.idDrink);
  };
}

function fetchDrinkById(id) {
  return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => response.json())
    .then(data => data.drinks[0]);
}

function handleNext() {
  if (currentIndex < viewedDrinks.length - 1) {
    currentIndex++;
    fetchDrinkById(viewedDrinks[currentIndex])
      .then(drink => {
        displayDrink(drink);
      })
      .catch(error => console.error("Error:", error));
  } else {
    // Fetch new random drink
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(response => response.json())
      .then(data => {
        const drink = data.drinks[0];
        viewedDrinks.push(drink.idDrink);
        currentIndex = viewedDrinks.length - 1;
        displayDrink(drink);
      })
      .catch(error => console.error("Error:", error));
  }
}

function handleBack() {
  if (currentIndex > 0) {
    currentIndex--;
    fetchDrinkById(viewedDrinks[currentIndex])
      .then(drink => {
        displayDrink(drink);
      })
      .catch(error => console.error("Error:", error));
  }
}


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
    viewedDrinks.push(drink.idDrink);
    displayDrink(drink);

    // display title in title container
   
  })
  .catch((error) => {
    console.error("Error:", error);
  });

  nextButton.addEventListener('click', handleNext);
  backButton.addEventListener('click', handleBack);
