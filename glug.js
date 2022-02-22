const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-content');
const recipeCloseBtn = document.getElementById('close-btn');

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchInputTxt == "") { alert("invalid input"); }
    else {

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
            .then((response => response.json()), function (error) {
                alert("Check Your Internet Connection");
            })
            .then(data => {
                let html = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        html += `
                        <div class = "meal-items" data-id = "${meal.idMeal}">
                            <div class = "meal-img">
                                <img src = "${meal.strMealThumb}" alt = "food">
                            </div>
                            <div class = "meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href = "#" class = "recipe">Recipe</a>
                            </div>
                        </div>
                    `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "oops, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }

                mealList.innerHTML = html;
            });
    }
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
    <h2>${meal.strMeal}</h2>
    <div class="recipe-instruct">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="img">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Click To Watch Video</a>
    </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}