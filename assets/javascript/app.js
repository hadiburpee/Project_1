var searchParam = [];
var ingredientsCounter = -1;
var searchResponse = null;
var searchYoutube = null;



function recipeSearch(x, y) {
var queryURL = "http://api.edamam.com/search?q=" + x + "&app_id=f2e7d5eb&app_key=f6c831dedf07d960068e68c5e0623e97";

    $.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    searchResponse = response;
    // console.log(response);
  
    console.log(searchResponse);



    for (var i = 0; i < searchResponse.hits.length; i++) {
        // Creates a div to hold ALL of the recipe results
        var recipeDiv = $("#ingredientsList");
        // Creates a div to hold INDIVIDUAL results
        var eachResult = $("<div>");
        eachResult.addClass("eachResult");
        // Recipe title
        var mealTitle = $("<p>").text(searchResponse.hits[i].recipe.label);
        mealTitle.addClass("mealTitle");
        // View recipe button
        var viewRecipe = $("<button>");
        viewRecipe.addClass("viewRecipe");
        viewRecipe.attr("value", searchResponse.hits[i].recipe.label);
        viewRecipe.text("View Recipe");
        // console.log(mealTitle);
        // console.log("Value:" + viewRecipe);

        // Recipe Image
        var imgTag = $("<img>");
        imgTag.addClass("recipeImage");
        imgTag.attr("src", searchResponse.hits[i].recipe.image);
        imgTag.attr("alt", "Recipe Image");
        
        eachResult.append(imgTag, mealTitle, viewRecipe);
        recipeDiv.prepend(eachResult);

        
        
    }
    searchYoutube = $(".viewRecipe").val();
});
}


$(document).on("click", ".viewRecipe", function(event) {

    event.preventDefault();
    var storeTitle = $(this).val();
    console.log(storeTitle);

    youtubeSearchAPI(storeTitle);
});



// Add item
$("#addItem").on("click", function() {

    ingredientsCounter++;
    searchParam.push($("#input-ingredient").val().trim());
    console.log(searchParam);
    var newDiv = $("<div>");
    newDiv.attr("value", searchParam);
    newDiv.addClass("ingredients");
    newDiv.text(searchParam[ingredientsCounter]);
    $("#ingredientsList").append(newDiv);
 
    $("#input-ingredient").val("");
    
});

// Search Recipes
$("#recipeSearch").on("click", function() {

    $(".ingredients").val(recipeSearch(searchParam));
    $("#ingredientsList").html("");

});



    // NAvigate to ingredients
    // var ingredients = $("<p>").text(searchResponse.hits[i].recipe.ingredientLines);
    // ingredients.addClass("ingredients");



    // =================================YOUTUBE API ======================================

    

    // Creating an AJAX call for the specific recipe button being clicked
    function youtubeSearchAPI(recipe) {


    var queryURL2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + recipe + " recipe" + "&key=AIzaSyBRPCZsyEmsspOCYbRltXGrLgf8-o9YIRY";


    $.ajax({
        url: queryURL2,
        method: "GET"
        }).then(function(response) {
            console.log(response);

        }, function(err){
        console.log('*****',err)
    });

    
};


