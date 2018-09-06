$(document).ready(initializeApp)

function initializeApp(){
<<<<<<< HEAD
    console.log('Initialized App');
=======
    getYelpData();
>>>>>>> 62e41c7037849a4708656e1380f6f17bf55e61ee
    movieListingsOnDOM(); //appends movies to the dom
<<<<<<< HEAD
    newYorkTimesAjax();
    loadSearchBar(); //appends searchBar to dom
    clickHandler(); //runs click handler
}

/****************************************************************************************************
 * clickHandler
 * @params {undefined} none
 * @returns: {undefined} none
 * Attaches click handler to run different functions when clicking on their respective buttons*/

function clickHandler(){
    $('#submitButton').click(getYelpData);
=======
    addressCoordinates();
    $('.movieRow').on('click', clickHandlerToOpenNewPage)
>>>>>>> dev
}





//Global Variables
var movieListings = [];
var summary;
var linkToReview;


// * @calls ajax new york times
// * @params called query value is movie title
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


var tmdbAjaxConfig = {
    async: true,
    crossDomain: true,
    method: "get",
    url: "https://api.themoviedb.org/3/movie/now_playing",
    data: {
        page: '1',
        language:'en-US',
        api_key:'487eb0704123bb2cd56c706660e4bb4d'
    },
    success: successfulTmdbCall,
    error:
    // "headers": {},
    // "data": "{}",
    // "movie_id": "{}",

  };
  
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
        var addMovieRow = $('<div>').addClass('movieRow').attr('data-title', movieTitle);
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
<<<<<<< HEAD
=======


function addressCoordinates(){
    var ajaxParams = {
        url: "https://api.opencagedata.com/geocode/v1/json",
        data: {
            key: "52645efc693e4815825c94314f6d5f77",
            q: "columbus, Ohio",
        },
        success: successfullAddressCoordinates
    }  
    $.ajax(ajaxParams)
}
function successfullAddressCoordinates(responseCoordinates){
    console.log('responseCoordinates', responseCoordinates);
}


function clickHandlerToOpenNewPage (){
  console.log($(this));
  var someOfThis = $(this);
  console.log($(this).attr('data-title'))
  $('.movie-container').empty();
  newYorkTimesAjax($(this).attr('data-title'))
  dynamicallyCreateMovieInfoPage($(this));
}
<<<<<<< HEAD
>>>>>>> dev
=======

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
  var mapDiv = $('<div>').addClass("map-section")
  var iFrameContainer = $('<div>').addClass("iframe-container");
  var iframe = $('<iframe>').attr('src', 'https://www.google.com/maps/embed/v1/place?q=Irvine%2C%20CA%2C%20USA&key=AIzaSyBI0B0aIkj-pe1nbofWBBTXGswH4dBA-ck').css({
    'width': '450',
    'height': '450',
  });
  var section2 = $('<section>').addClass("movie-trailer-container col-md-9")
  var movieTitle = $('<h2>').addClass("movieTitle").text("Mission: Impossible - Fallout")
  var movieTrailer = $('<div>').addClass("movieTrailer")
  var movieTrailerImage = $('<img>').attr('src', "http://blog.gowebagency.co.uk/wp-content/uploads/2016/10/youtube-image.png").css('width', '100%')
  var h5Summary = $('<h5>').text("Summary")
  var pSummary = $('<p>').addClass("movieSummary")
  var h5NYT = $('<h5>').text("Read the review")
  $(movieTrailer).append(movieTrailerImage);
  $(pSummary).append(summary);
  $(h5NYT).append(linkToReview);
  $(section2).append(movieTitle, movieTrailer,h5Summary, pSummary, h5NYT);
  $(iFrameContainer).append(iframe);
  $(mapDiv).append(iFrameContainer);
  $(p1).append(i1, span1);
  $(movieReviewsDiv).append(p1);
  $(section1).append(poster, movieReviewsDiv, mapDiv)
  $(wrapper).append(section1, section2);
  $('body').append(wrapper);
}, 2000)}
>>>>>>> 62e41c7037849a4708656e1380f6f17bf55e61ee
