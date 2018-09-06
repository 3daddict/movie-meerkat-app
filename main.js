$(document).ready(initializeApp)

function initializeApp(){
    console.log('Initialized App');
    movieListingsOnDOM(); //appends movies to the dom
    clickHandler(); //runs click handler
    addressCoordinates();


$(".movieRow").hover(function(){
    $(".movieEffects").hover(function(){
        $(this).addClass('darkPoster');
        $(this).next().removeClass('movieCardHide');
        }, function(){
            $(this).removeClass('darkPoster');
            $(this).next().addClass('movieCardHide');
    });
});
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
var yelpResult;



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
        var addMovieRow = $('<div>').addClass('movieRow').attr({'data-title': movieTitle,'data-id': themoviedb, 'movieRating': movieRating});
        var addMoviePoster = $('<img>').addClass('movieEffects').attr('src', 'http://image.tmdb.org/t/p/w185' + moviePoster);
        var addMovieContainer = $('<div>').addClass('movieCardInfo').addClass('movieCardHide');

        var addMovieTitle = $('<p>').addClass('movieTitle ');
        addMovieTitle.append(movieTitle);
        var addReviewStar = $('<i>').addClass(' fas fa-star').css('color', 'yellow');
        var addMovieRating = $('<p>').addClass('movieRating');
        addMovieRating.append(addReviewStar, " ", movieRating);
        addMovieContainer.append(addMovieTitle, addMovieRating);
        $(".movie-container").append(addMovieRow);
        addMovieRow.append(addMoviePoster, addMovieContainer);
    }
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
    yelpResult = response.businesses;
    initMap();
}

/****************************************************************************************************
 * createMapMarkers
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call to pass Yelp object into function to create map markers*/

function createMapMarkers(results){
    var listings = results.businesses;
    for (var i = 0; i < listings.length; i++) {
        var coords = listings[i].coordinates;
        var latLng = new google.maps.LatLng(coords['latitude'],coords['longitude']);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
});}}

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
function initMap() {
    var learningFuze = {lat: 33.634857, lng: -117.74044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: learningFuze
    });

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Theater Name</h1>' +
        '<div id="bodyContent">' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 250,
        maxHeight: 100
    });

    var marker = new google.maps.Marker({
        position: learningFuze,
        map: map,
        title: 'LearningFuze'
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    for(var i = 0; i < 10; i++){
        var position = {lat: yelpResult[i]['coordinates']['latitude'], lng: yelpResult[i]['coordinates']['longitude']};
        var newMarker = new google.maps.Marker({
            position: position,
            map: map,
            title: yelpResult['name']
        });
}}


function clickHandlerToOpenNewPage (){

  console.log($(this));
  var someOfThis = $(this);
  console.log($(this).attr('data-title'))
  $('.movieRow').remove();
  findMovieID($(this).attr('data-id'));

  if($(this).attr('data-title') === "Ocean's Eight"){
      $(this).attr('data-title', "Ocean's 8");
  }

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
}

function dynamicallyCreateMovieInfoPage(someOfThis){
  var myFuntion = setTimeout(function(){
  $('.poster').attr('src', someOfThis[0].firstElementChild.currentSrc)
  $('.starIcon').addClass("fas fa-star");
  $(".movieRatingData").text(' ' + someOfThis.attr('movieRating')+ ' / 10');
  $('#map').css('display', 'inline-block');
  $('.searchBarContainer').css('display', 'inline-block');
  $('.movieTitle').text(someOfThis.attr('data-title'))
  $('.movieTrailer').append(addTrailerRow);
  $('.summary').text("Summary")
  $('.reviewTitle').text("Read the review")
  $('.backButton').css('display', 'inline-block').text('Back').addClass('btn btn-danger');
  $('.backButton').on('click', function(){
      $('#searchBarContainer').css('display', 'none');
      $('.movie-wrapper').empty();
      $('#map').css('display', 'none');
      initializeApp();
  })
  $('.movieSummary').append(summary);
  $('.nytReview').append(linkToReview);
  $('.movie-trailer-container').append( button, mapID);
  $('.movie-stats').append( movieReviewsDiv);
}, 2000)}

