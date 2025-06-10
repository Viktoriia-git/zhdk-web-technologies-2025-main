// Додаємо функцію removeFavorite
function removeFavorite(drinkId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites = favorites.filter(drink => drink.idDrink !== drinkId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function displayFavorites() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (favorites.length === 0) {
    favoritesGrid.innerHTML = '<p>No favorite cocktails yet</p>';
    return;
  }

  favoritesGrid.innerHTML = favorites.map(drink => `
    <div class="card">
      <div class="main-image">
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
        <button class="like-button liked" data-id="${drink.idDrink}">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">favorite</span>
        </button>
      </div>
      <div class="drink-description">
        <h1>${drink.strDrink}</h1>
        <ul class="ingredients">
          ${getIngredientsList(drink)}
        </ul>
        <p class="glass-info">Glass: ${drink.strGlass}</p>
      </div>
    </div>
  `).join('');

  // Додаємо обробники кліків для кнопок лайків
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', () => {
      const drinkId = button.dataset.id;
      removeFavorite(drinkId);
      displayFavorites(); // Оновлюємо відображення після видалення
    });
  });
}

function getIngredientsList(drink) {
  let ingredients = '';
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      ingredients += `<li>${measure ? measure.trim() : ''} ${ingredient}</li>`;
    }
  }
  return ingredients;
}

// Відображаємо улюблені при завантаженні сторінки
document.addEventListener('DOMContentLoaded', displayFavorites); 