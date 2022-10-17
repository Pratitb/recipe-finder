const inputEle = document.querySelector('#finder_one')
const mealCards = document.querySelector('.meal_cards')
const clearBtn = document.querySelector('#clearBtn')
let recipeDetailWrap = document.querySelector('.recipe_detail_wrap')
const mealWrap = document.querySelector('.meal_cards')
let recipeDetail = document.querySelector('.recipe_detail')

inputEle.addEventListener('keyup', checkKeyNumber)
mealWrap.addEventListener('click', openRecipeDetail)
clearBtn.addEventListener('click', clearInp)

function checkKeyNumber(keynumber){
    if(keynumber.keyCode == 13){
        clearBtn.classList.remove('hidden')
        findMeals()
    }
}

function clearInp(){
    inputEle.value = ''
    inputEle.focus()
}

function findMeals(){
    let inputEleVal = inputEle.value.trim()
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputEleVal}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let meals = ''
        
        if(data.meals){
            data.meals.forEach(meal => {
                meals+= `
                <div class="meal" id="${meal.idMeal}">
                    <div class="meal_content">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal_img">
                        <p class="meal_name">${meal.strMeal}</p>
                    </div>
                    <a class="meal_recipe_btn">Read recipe</a>
                </div>
                `  
            });
            
        }
        else{
            meals+= `<p class="noMeals">Sorry! We did not find any recipes for this ingredient. Please look for something else.</p>`
        }

        mealCards.innerHTML = meals
        
    })
}

function openRecipeDetail(recipeBtn){
    if(recipeBtn.target.classList.contains('meal_recipe_btn')){
        let mealBox = recipeBtn.target.parentElement.id
        console.log(mealBox)
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealBox}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.meals)
            createModal(data.meals)
        })
    }
}

function createModal(meal){
    console.log(meal)
    meal = meal[0]
    recipeDetailWrap.innerHTML = ''
    recipeDetailWrap.classList.add('showRecipeDetail')
    recipeDetailWrap.classList.remove('hideRecipeDetail')
    let recipeDetail = `
    <div class="recipe_detail">
        <div class="close_btn">&#x2716</div>
        <div class="recipe_detail_one">
            <p class="recipe_meal_name">${meal.strMeal}</p>
            <div class="recipe_category_area">
                <p class="recipe_category_name">${meal.strCategory}</p>
                <p class="recipe_category_name">${meal.strArea}</p>
                
            </div>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe_img">
        </div>
        <div class="recipe_detail_two">
            <div class="recipe_instructions"><ol><li>${meal.strInstructions}</li></ol></div>
        </div>
    </div>
    `

    recipeDetailWrap.innerHTML += recipeDetail
    recipeDetailWrap.classList.add('showRecipeDetail')
    shiftToNewLine()
    document.querySelector('.close_btn').addEventListener('click', closeRecipeDetail)
}

function closeRecipeDetail(){
    recipeDetailWrap.classList.add('hideRecipeDetail')
}

function shiftToNewLine(){
    let recipeInstr = document.querySelector('.recipe_instructions')
    recipeInstr.innerHTML = recipeInstr.innerHTML.replace(/\./g, '.<br><br>')
}