$(document).ready(initializeApp)

function initializeApp(){
    console.log('Initialized App');
    getYelpData();
    movieListingsOnDOM(); //appends movies to the dom
    newYorkTimesAjax();
    // loadSearchBar(); //appends searchBar to dom
    clickHandler(); //runs click handler
    addressCoordinates();
}

/****************************************************************************************************
 * clickHandler
 * @params {undefined} none
 * @returns: {undefined} none
 * Attaches click handler to run different functions when clicking on their respective buttons*/

function clickHandler(){
    $('#submitButton').click(getYelpData);
    // addressCoordinates();
    $('.movieRow').on('click', clickHandlerToOpenNewPage)
}





//Global Variables
var movieListings = [];
var summary;
var linkToReview;
var addTrailerRow;
var lat;
var lng;



//has ajax paramaters
//@calls ajax new york times
//@params called query value is movie title

function newYorkTimesAjax (movieTitle){
    var newYorkTimesParams = {
      url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json",
      method: 'GET',
      data: {
        'api-key': "8f55164da30c48c9ba4dc79d9fce1827",
          "query": movieTitle,
      },
      success: newYorkTimesAjaxSuccessful,
      error: newYorkTimesAjaxError,
    }
    
    

    $.ajax( newYorkTimesParams );
}


// * @params responseData
// * returns link and summary for movie
function newYorkTimesAjaxSuccessful(responseData){
    console.log("responseData:", responseData);
    linkToReview = $('<div>').text(responseData.results[0].summary_short);
    summary = $('<a>').text(responseData.results[0].link.url).attr('href', responseData.results[0].link.url);
}




// * @returns appends text that says they are unavailable at this time
function newYorkTimesAjaxError(){
  console.log('error NYT');
}



// * TMDB Ajax Function
// * @param  {} settings
// * @param  {} .done(function(response))
// * @returns: {response} 
// * calls the the movie database API*/

/****************************************************************************************************
 * gettmdbData
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/


// var tmdbAjaxConfig = {
//     async: true,
//     crossDomain: true,
//     method: "get",
//     url: "https://api.themoviedb.org/3/movie/now_playing",
//     data: {
//         page: '1',
//         language:'en-US',
//         api_key:'487eb0704123bb2cd56c706660e4bb4d'
//     },
//     success: successfulTmdbCall,
    // error:
    // "headers": {},
    // "data": "{}",
    // "movie_id": "{}",

//   };
  
//   $.ajax(settings).done(function (response) {
//     console.log('pictures successful', response);
//     movieListings.push(response);
//   });

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
    "method": "GET",
    "headers": {},
    "data": "{}",
    "movie_id": "{}"
  }
  
  $.ajax(settings).done(function (response) {
    //console.log(response);
    movieListings.push(response);
  });

/****************************************************************************************************
 * successfulTmdbCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of tmdb AJAX Call*/

function successfulTmdbCall(response){
    console.log('Successful tmdb Call');
    movieListing.push(response);
}

/****************************************************************************************************
 * failedTmdbCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during fauilure of tmdb AJAX Call*/

function failedTmdbCall(){

    

}



// * movieListingsOnDOM Function
// * @param  {} none 
// * @returns: {} none 
// * appends movieListings to the DOM*/
function movieListingsOnDOM(){
    
    for(var i = 0; i < movieListings[0].results.length; i++){
        var movieTitle = movieListings[0].results[i].title;
        var moviePoster = movieListings[0].results[i].poster_path;
        var movieRating = movieListings[0].results[i].vote_average;
        var themoviedb = movieListings[0].results[i].id;
        var addMovieRow = $('<div>').addClass('movieRow').attr({'data-title': movieTitle,'data-id': themoviedb});
        var addMoviePoster = $('<img>').attr('src', 'http://image.tmdb.org/t/p/w185' + moviePoster);
        var addMovieContainer = $('<div>').addClass('movieCardInfo');
        var addMovieTitle = $('<p>').addClass('movieTitle ');
        addMovieTitle.append(movieTitle);
        var addMovieRating = $('<p>').addClass('movieRating');
        addMovieRating.append(movieRating);
        addMovieContainer.append(addMovieTitle, addMovieRating);
        $(".movie-container").append(addMovieRow);
        addMovieRow.append(addMoviePoster, addMovieContainer);
    }
}

/****************************************************************************************************
 * loadSearchBar
 * @params {undefined} none
 * @returns: {undefined} none
 * Uses DOM creation to load the searchBar*/

function loadSearchBar(){
    console.log('load search bar running');
    var searchBarContainer = $('<div>').attr('id','searchBarContainer');
    var searchBar = $('<input>').attr({'type':'text', 'value':'Address','id':'searchBar'});
    var submitButton = $('<input>').attr({'id':'submitButton','type':'submit'});
    searchBarContainer.append(searchBar, submitButton);
    $('body').append(searchBarContainer);
}
/****************************************************************************************************
 * getYelpData
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/

function getYelpData() {
    var location = $('#searchBar').val();
    var yelpAjaxConfig = {
        dataType: 'json',
        url: 'http://yelp.ongandy.com/businesses',
        method: 'post',
        data: {
            api_key: 'vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx',
            location: location,
            term: 'movie theater',
            sort_by: 'distance'
        },
        // api_key: 'vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx',
        // // latitude: 33.6846, //This section needs to be updated with the latitude based on user input coming from MapBox
        // // longitude: -117.8265, //This section needs to be updated with the longitude based on user input coming from MapBox
        // location: location,
        // term: 'movie theater',
        success: successfulYelpCall,
        error: failedYelpCall,
    }

    $.ajax(yelpAjaxConfig);
}

/****************************************************************************************************
 * successfulYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call*/

function successfulYelpCall(response){
    console.log('Yelp call ran successfully');
    console.log(response);
    // console.log('Theater NAme: ' + response['businessess'].name);
}

/****************************************************************************************************
 * FailedYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/

function failedYelpCall(){
    console.log('Yelp call Failed');
}


function addressCoordinates(){
    var ajaxParams = {
        url: "https://api.opencagedata.com/geocode/v1/json",
        data: {
            key: "52645efc693e4815825c94314f6d5f77",
            q: $('.searchBar').val()
            // q: 'Columbus, Ohio'
        },
        success: successfullAddressCoordinates
    }  
    $.ajax(ajaxParams)
}
function successfullAddressCoordinates(responseCoordinates){
    console.log('responseCoordinates', responseCoordinates);
     lat = responseCoordinates.results[0].geometry.lat;
     lng = responseCoordinates.results[0].geometry.lng;
    initMap(lat,lng);
    
}

//  var map;
// function initMap(lat,lng) {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: lat , lng: lng},
//     zoom: 8
//   });
//   $('#map').append(map);
// }
// function initMap(lat,lng) {
//     // The location
//     var movieTheaters = {lat: lat, lng: lng};
//     // The map, centered at location
//     var map = new google.maps.Map(
//         document.getElementById('map'), {zoom: 8, center: movieTheaters});
//     // The marker, positioned at location
//     var marker = new google.maps.Marker({position: movieTheaters, map: map});
//   }


var map;
      function initMap(lat,lng) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: new google.maps.LatLng(lat,lng),
        //   mapTypeId: 'terrain',
        });

        // Create a <script> tag and set the USGS URL as the source.
        var script = document.createElement('script');
        // This example uses a local copy of the GeoJSON stored at
        // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
        script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
        document.getElementsByTagName('head')[0].appendChild(script);
      }

      // Loop through the results array and place a marker for each
      // set of coordinates.
      window.eqfeed_callback = function(results) {
        for (var i = 0; i < results.features.length; i++) {
          var coords = results.features[i].geometry.coordinates;
          var latLng = new google.maps.LatLng(coords[1],coords[0]);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
        }
      
      }



function clickHandlerToOpenNewPage (){

  console.log($(this));
  var someOfThis = $(this);
  console.log($(this).attr('data-title'))
  $('.movie-container').empty();
  findMovieID($(this).attr('data-id'));
  newYorkTimesAjax($(this).attr('data-title'));
  dynamicallyCreateMovieInfoPage($(this));
  addressCoordinates();

}

/****************************************************************************************************
 * YouTubeApi
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/
function findMovieID(tmdbID){
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/" + tmdbID + "/videos?language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
    console.log('Origninsal API Data: ' + response.results[0].key);
    dynamicYoutubeVideo(response.results[0].key);
  });
}

/****************************************************************************************************
 * 
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/

function dynamicYoutubeVideo(movieTrailerID) {
    console.log('It should be on the DOM')

    addTrailerRow = $('<iframe>');
    addTrailerRow.addClass('youtubePlayer').attr('src', 'https://www.youtube.com/embed/' + movieTrailerID).attr('frameborder', '0').attr('allow', 'autoplay; encrypted-media').attr('allowfullscreen');
    $(".movieTrailer").empty();
   //$(".movieTrailer").append(addTrailerRow);
    
{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/wVTIJBNBYoM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> */}
}

function dynamicallyCreateMovieInfoPage(someOfThis){
  var myFuntion = setTimeout(function(){
  console.log('summary:', summary, 'linktoreview:', linkToReview)
  console.log(someOfThis)
  var wrapper = $('<div>').addClass('movie-wrapper row justify-content-center');
  var section1 = $('<section>').addClass('movie-stats col-md-2 text-center');
  var poster = $('<img>').attr('src', someOfThis[0].firstElementChild.currentSrc)
  var movieReviewsDiv = $('<div>').addClass("movieReviews");
  var p1 = $('<p>');
  var i1 = $('<i>').addClass("fas fa-star").css('color', 'yellow');
  var span1 = $('<span>').addClass("movieRatingData").text(0);
  $('#map').css('display', 'inline-block');
  var section2 = $('<section>').addClass("movie-trailer-container col-md-9")
  var movieTitle = $('<h2>').addClass("movieTitle").text("Mission: Impossible - Fallout")
  var movieTrailer = $('<div>').addClass("movieTrailer")
  $(movieTrailer).append(addTrailerRow);
  var h5Summary = $('<h5>').text("Summary")
  var pSummary = $('<p>').addClass("movieSummary")
  var h5NYT = $('<h5>').text("Read the review")
  $(pSummary).append(linkToReview);
  $(h5NYT).append(summary);
  $(section2).append(movieTitle, movieTrailer,h5Summary, pSummary, h5NYT);
  $(p1).append(i1, span1);
  $(movieReviewsDiv).append(p1);
  $(section1).append(poster, movieReviewsDiv)
  $(wrapper).append(section1, section2);
  $('.movie-container').append(wrapper);
}, 2000)}

