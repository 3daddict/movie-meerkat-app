$(document).ready(initializeApp)

function initializeApp(){
    console.log('Initialized App');
    movieListingsOnDOM(); //appends movies to the dom
    loadSearchBar(); //appends searchBar to dom
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
    summary = $('<div>').text(responseData.results[0].summary_short);
    linkToReview = $('<a>').text(responseData.results[0].link.url).attr('href', responseData.results[0].link.url);
}




// * @returns appends text that says they are unavailable at this time
function newYorkTimesAjaxError(){
  console.log('error NYT');
  linkToReview = $('<div>').text('Link not available for this movie');
  summary = $('<a>').text('Summary not available for this movie');
}



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
        var addMovieRow = $('<div>').addClass('movieRow').attr({'data-title': movieTitle,'data-id': themoviedb, 'movie-rating': movieRating});
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
    $('nav.navbar div').append(searchBarContainer);
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
        location: location,
        term: 'movie theater',
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
    console.log('Theater Name: ',response.businesses[0]['name']);
    console.log('Coordinates: ',response.businesses[0]['coordinates']);
    console.log('Latitude: ',response.businesses[0]['coordinates']['latitude']);
    console.log('Longitude: ',response.businesses[0]['coordinates']['longitude']);
    console.log('Distance :',((response.businesses[0]['distance'])*0.00062137).toFixed(2), ' mi');
    console.log('Street: ',response.businesses[0]['location']['display_address'][0]);
    console.log('City, State, Zip: ',response.businesses[0]['location']['display_address'][1]);

    console.log('Phone: ',response.businesses[0]['phone']);
    console.log('Rating :',response.businesses[0]['rating']);
    console.log('Review :',response.businesses[0]['review_count']);

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

/****************************************************************************************************
 * createYelpListings
 * @params {undefined} none
 * @returns: {undefined} none
 * Puts Yelp data in a listings page*/

// function createYelpListings(){
//
//     for(var i = 0; i < )
//
//
//
//     $('<div>').append()
//
//
//
//
// }



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

  if($(this).attr('data-title') === "Ocean's Eight"){
      $(this).attr('data-title', "Ocean's 8");
  }
  debugger;
  if($(this).attr('data-title') !== "The Seven Deadly Sins: Prisoners of the Sky"){
  newYorkTimesAjax($(this).attr('data-title'))
  }else{
    newYorkTimesAjaxError();
  }

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
  var movieTitle = $('<h1>').addClass("movieTitle").text(someOfThis.attr('data-title'))
  var movieTrailer = $('<div>').addClass("movieTrailer")
  $(movieTrailer).append(addTrailerRow);
  var h5Summary = $('<h4>').text("Summary")
  var pSummary = $('<p>').addClass("movieSummary")

  var nytContainerDiv = $('<div>').addClass("nytReviewContainer");
  var h5NYT = $('<h4>').text("Read the review")
  var NYTP = $('<p>').addClass("nytReview");
  var button = $('<button>').text('Back').addClass('btn btn-danger');
  $(button).on('click', function(){
      $('.movie-wrapper').remove();
      initializeApp();
  })
  $(nytContainerDiv).append(h5NYT, NYTP);
  $(pSummary).append(summary);
  $(NYTP).append(linkToReview);
  $(section2).append(movieTitle, movieTrailer ,h5Summary, pSummary, nytContainerDiv, button);

  $(p1).append(i1, span1);
  $(movieReviewsDiv).append(p1);
  $(section1).append(poster, movieReviewsDiv)
  $(wrapper).append(section1, section2);
  $('.movie-container').append(wrapper);
}, 2000)}

