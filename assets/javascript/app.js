
var searchParam = [];


function recipeSearch(x, y) {
var queryURL = "http://api.edamam.com/search?q=" + x + "&app_id=f2e7d5eb&app_key=f6c831dedf07d960068e68c5e0623e97";

    $.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    console.log(response);


});
}


$("#addItem").on("click", function() {

    searchParam.push($("#input-ingredient").val().trim());
    console.log(searchParam);
    var newDiv = $("<div>");
    newDiv.attr("value", searchParam);
    newDiv.addClass("ingredients");
    newDiv.text(searchParam);
    $(".jumbotron").append(newDiv);
 
    // recipeSearch(seachParam, "cheese");
});

$("#recipeSearch").on("click", function() {

    $(".ingredients").val(recipeSearch(searchParam));

});


