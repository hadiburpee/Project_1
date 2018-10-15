var searchParam = [];
var ingredientsCounter = -1;
var searchResponse = null;
var youTubeResponse = null;
var searchYoutube = null;
var instructions = null;
var tubeSearch = false;
var reset =  false;

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCN2egZvBwkjcRawYcQ6v314gMNbvB8hDM",
    authDomain: "ucla-project-1-218617.firebaseapp.com",
    databaseURL: "https://ucla-project-1-218617.firebaseio.com",
    projectId: "ucla-project-1-218617",
    storageBucket: "ucla-project-1-218617.appspot.com",
    messagingSenderId: "993757207683"
};
    firebase.initializeApp(config);
    var database = firebase.database();


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
        viewRecipe.attr("link", searchResponse.hits[i].recipe.ingredientLines);
        viewRecipe.attr("cal", searchResponse.hits[i].recipe.calories);
        viewRecipe.attr("origSrc", searchResponse.hits[i].recipe.url);
        viewRecipe.attr("srcName", searchResponse.hits[i].recipe.source);
        viewRecipe.attr("healthLabels", searchResponse.hits[i].recipe.healthLabels);
        viewRecipe.attr("imageLink", searchResponse.hits[i].recipe.image);
        viewRecipe.text("View Recipe");
        // console.log(mealTitle);
        // console.log("Value:" + viewRecipe);

        //adds a favorite button and stores necessary information for
        var addFavorite = $("<button>");
        addFavorite.addClass("addFavorite");
        addFavorite.attr("value", searchResponse.hits[i].recipe.label);
        addFavorite.attr("link", searchResponse.hits[i].recipe.url);
        addFavorite.attr("imageLink", searchResponse.hits[i].recipe.image);
        addFavorite.text("Favorite");

        // Recipe Image
        var imgTag = $("<img>");
        imgTag.addClass("recipeImage");
        imgTag.attr("src", searchResponse.hits[i].recipe.image);
        imgTag.attr("alt", "Recipe Image");
        
        eachResult.append(imgTag, mealTitle, viewRecipe, addFavorite);
        recipeDiv.prepend(eachResult);

        
        
    }
    searchYoutube = $(".viewRecipe").val();

});
}


$(document).on("click", ".viewRecipe", function(event) {

    event.preventDefault();

    //clears youtube video div
    $("#youTubeVids").empty();

    // Recipe Title
    var storeTitle = $(this).val();
    $("#modalTitle").text(storeTitle);
    // Recipe Image
    var instructionsImage = $(this).attr("imageLink");
    $("#modalImage").attr("src", instructionsImage);
    // Calories 
    var calories = $(this).attr("cal");
    $("#calorieCount").text("Calorie Count: " + Math.floor(calories));
    // Health Labels
    var healthLabels = $(this).attr("healthLabels");
    $("#healthLabels").text(healthLabels);




    // Original Source
    var originalSource = $(this).attr("origSrc");
    var sourceName = $(this).attr("srcName");
    $("#originalSOurce").text(sourceName);
    $("#originalSOurce").attr("href", originalSource);



    // Instructions
    var instructions = $(this).attr("link");
    $("#recipeInstructions").text(instructions);

    //pull the value from the viewRecipe class
    var searchYou = $(this).val();

    console.log("search you" + searchYou);
    //displays the modal
    modalUp();
    
    // Call youtube API
    youtubeSearchAPI(searchYou);

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
    //for the reset button
    reset = false;

});

$(document).on("click", "#addItem", function(){

    event.preventDefault();
});

// Search Recipes
$("#recipeSearch").on("click", function() {

    $(".ingredients").val(recipeSearch(searchParam));
    $("#ingredientsList").html("");
    

});



    

    //function to store favorites
    $(document).on("click", ".addFavorite", function(){
        var storeMeal = $(this).attr("value");
        var mealLink = $(this).attr("link");
        var imageLink = $(this).attr("imageLink")
        // var mealLink = $(this).attr("link")
        console.log("Meal Title click: " + storeMeal);
        //adds a new child for every favorite clicked and stores the title, the link and the image
        database.ref().push({
            title: storeMeal,
            link: mealLink,
            image: imageLink
        });
    });


    //function button reset everything and allow to add new ingredients

    $(document).on("click", "#resetButton", function(){
        console.log("reset value: " + reset);
        if(reset == false){
        resetDiv();
        reset = true;

        }

    });

    //reset function to be called in reset button and view favorites
    function resetDiv(){
        searchParam = [];
        $("#ingredientsList").empty();
        ingredientsCounter = -1;
    }


    //for a button to view favorites
    $(document).on("click", "#viewFavorites", function(){
        resetDiv();
        database.ref().on("child_added", function(snapshot){
            var mealTitle = snapshot.val().title;
            var mealLink = snapshot.val().link;
            var imageLink = snapshot.val().image;
            var addFav = $("<div>");
            var addImg = $("<img>");
            addImg.attr('src', imageLink);
            var addLink = $("<a>");
            addLink.attr('href', mealLink);
            addLink.text(mealTitle);
            addFav.addClass(".eachResult");
            $("#ingredientsList").append(mealTitle, addLink, addImg);


        });



    });






    // =================================YOUTUBE API ======================================
    // Creating an AJAX call for the specific recipe button being clicked
    function youtubeSearchAPI(recipe) {

        
    var queryURL2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + recipe + " how to make" + "&key=AIzaSyBRPCZsyEmsspOCYbRltXGrLgf8-o9YIRY";


    $.ajax({
        url: queryURL2,
        method: "GET"
        }).then(function(response) {
            console.log(response);
            console.log(response.items[0].id.videoId);
        
            //for loop to call addVideo function for youtube display    
        for(i=0; i<3; i++){
            youTubeResponse = response.items[i].id.videoId; 
            addVideo(youTubeResponse);
            //allows for reset button to work
            reset = false;
        }
        }, function(err){
        console.log('*****',err)

    });
    
};

//function to dynamically add video to screen
function addVideo(x){
    var url = "https://www.youtube.com/embed/" + x;
    var newDiv = $("<iframe>");
    newDiv.attr('id', 'frameVid').attr('width', '350').attr('height','150').attr('frameborder', '0').attr("allowfullscreen", '').attr('src', url);
    console.log(newDiv);
    $("#youTubeVids").append(newDiv);
}

// MODAL 
// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
function modalUp () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

