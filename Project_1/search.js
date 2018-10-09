var topics = [ ];

// Generic function for displaying topic data
function renderButtons(){

	// Deletes the topics prior to adding new topics (this is necessary otherwise you will have repeat buttons)
	$('#topics-buttons').empty();

	// Loops through the array of topics
	for (var i = 0; i < topics.length; i++){
	    //Dynamically generate buttons for each topic in the array
	    $("#topics-buttons").append("<button class='gifButton' data-button='" + topics[i] +"'>" + topics[i] + "</button>");
	}
}

// This function handles events where one button is clicked
$('#add-topics').on('click', function(event){
    event.preventDefault();

	// This line of code will grab the input from the textbox
	var newTopic = $('#topics-input').val().trim();

	// The topic from the textbox is then added to our array
	topics.push(newTopic);

	// Our array then runs which handles the processing of our topics array
	renderButtons();

	// Clears the topics-input text
	$("#topics-input").val("");

	// We have this line so that users can hit "enter" instead of clicking on the button and it won't move to the next page
	return false;
});
//Event listener for all button elements
$(document).on("click", ".gifButton", function() {
    // In this case, the "this" keyword refers to the button that was clicked
     var buttonClicked = $(this).data("button");

  console.log(buttonClicked);

  var queryURL = "http://api.edamam.com/search?q=" +
  buttonClicked + "&app_id=f2e7d5eb&app_key=f6c831dedf07d960068e68c5e0623e97"; //first 10 items

  // Creates AJAX call for the specific topic being
  $.ajax({
      url: queryURL,
      method: 'GET'}).done(function(response) {

      // Storing an array of results in the results variable
      var results = response.data;

      // Eliminates any images from the previous request
      $("#gifs-appear-here").empty();

       // Looping over every result item
      for (var i = 0; i < results.length; i++) {

          // Only taking action if the photo has an appropriate rating
          if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
              // Creating a div with the class "item"
              var gifDiv = $("<div class='item'>");

              // Storing the result item's rating
              var rating = results[i].rating;

              // Creating a paragraph tag with the result item's rating
              var p = $("<p>").text("Rating: " + rating);

              // Creating an image tag
              var personImage = $("<img>");

              // Giving the image tag an src attribute of a proprty pulled off the
              // result item
              personImage.attr("src", results[i].images.fixed_height_still.url);
              personImage.attr("data-still", results[i].images.fixed_height_still.url);
              personImage.attr("data-animate", results[i].images.fixed_height.url);
              personImage.attr("data-state", "still");
              personImage.addClass("gif");

              // Appending the paragraph and personImage we created to the "gifDiv" div we created
              gifDiv.append(personImage);
              gifDiv.append(p);

              // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
              $("#gifs-appear-here").prepend(gifDiv);
          }
      }
  });
});












// =================================== Recipe search API ==================================================
var searchParam = [];
function recipeSearch(x) {
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
  
// ==========






/*
The following code was written by Shan Eapen Koshy for codegena.com on March 2017
If you find any bugs, please feel free to write at shaneapen@codegena.com
*/

var myTimeout;

function youtube_parser() {
   clearTimeout( myTimeout );
   var urlBox = document.getElementById("ytUrl");
   var url = urlBox.value;
   var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
   var match = url.match(regExp);
   if (match && match[7].length == 11) {
      loadVideo(match[7]);
   } else if (urlBox.value != '') {
      // keyWordsearch();      
      myTimeout = setTimeout(keyWordsearch, 300);
   }else{
      reset();
   }
}

function loadVideo(id) {
   if (sessionStorage.currentID == id)
      return;
   sessionStorage.currentID = id;
   var video = document.getElementById("ytPlayer");
   video.setAttribute('src', "https://www.youtube.com/embed/" + id + "?autoplay=1&iv_load_policy=3&rel=0");   
}

function reset() {
   sessionStorage.clear();
   document.getElementById('ytUrl').value = "";
   document.getElementById("ytPlayer").setAttribute('src', 'https://youtube.com/embed/demo');
   document.getElementById('relatedVideos').innerHTML = "";
}

//Youtube Instant 
//Please use your own API key
function keyWordsearch() {
   gapi.client.setApiKey('AIzaSyCmh6oIkO9zVR5s7QtOeYwsZTN0lOV5OjI');
   gapi.client.load('youtube', 'v3', function() {     
      makeRequest();
   });
}
function makeRequest() {
   var q = document.getElementById('ytUrl').value;
   var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet', //changed from id to snippet to get video title and thumbnail
      type: 'video',
      maxResults: 6
   });
   request.execute(function(response) {

      var srchItems = response.result.items;     
      loadVideo(srchItems[0].id.videoId);
      document.getElementById('relatedVideos').innerHTML = "";
      for(i=1;i<6;++i){
         document.getElementById('relatedVideos').innerHTML += "<a onclick='loadVideo(\"" + srchItems[i].id.videoId +"\")'><img class='thumbnail' title='" + srchItems[i].snippet.title + "' src='" + srchItems[i].snippet.thumbnails.medium.url+ "'/></a>";
      }

   })
}

function createGif() {
   if (sessionStorage.currentID) {
      window.open("https://gifs.com/?source=https://youtu.be/" + sessionStorage.currentID);
   } else {
      alert("No video found!");
   }
}

function downloadVideo() {
   if (sessionStorage.currentID) {
      window.open("//keepvid.com/?url=https://youtu.be/" + sessionStorage.currentID);
   } else {
      alert("No video found");
   }
}

//ignores non alphanumeric key entry
document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;
   console.log(e.keyCode)

    if ((e.keyCode >=37 && e.keyCode <=40) || (e.keyCode >=173 && e.keyCode<=179)) {
      console.log('Ignored keyboard entry')
    }      

}