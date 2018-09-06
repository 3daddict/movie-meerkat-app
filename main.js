$(document).ready(initializeApp)

function initializeApp(){
    getYelpData();
    newYorkTimesAjax();
    movieListingsOnDOM(); //appends movies to the dom
    addressCoordinates();
    $('.movieRow').on('click', clickHandlerToOpenNewPage)
}

//Global Variables
var movieListings = [];


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

//what to do if ajax fires successfully
//finds the synopsis of the movie and appends it to the trailer
//finds the link to the whole review and appends it as well

function newYorkTimesAjaxSuccessful(responseData){
    console.log("responseData:", responseData);
    var linkToReview = $('<div>').text(responseData.results[0].summary_short);
    var summary = $('<a>').text(responseData.results[0].link.url).attr('href', responseData.results[0].link.url)
    $('body').append(summary, linkToReview);
  
}



//what to do if it ajax gets error from server
//instead of appending synospsis and link to review apeends tecx that says they are unavailable at this time
function newYorkTimesAjaxError(){
  console.log('error NYT');
}



// * TMDB Ajax Function
// * @param  {} settings
// * @param  {} .done(function(response))
// * @returns: {response} 
// * calls the the movie database API*/

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
        var addMovieRow = $('<div>').addClass('movieRow').attr('data-title', movieTitle).attr('data-id', themoviedb);
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
 * Yelp AJAX Call
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/

function getYelpData() {

    var yelpAjaxConfig = {
        dataType: 'json',
        url: 'http://yelp.ongandy.com/businesses',
        success: successfulYelpCall,
        error: failedYelpCall,
        latitude: 33.6846,
        longitude: -117.8265,
        term: 'movie theater'
    }

    $.ajax(yelpAjaxConfig);
}

/****************************************************************************************************
 * successfulYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call*/

function successfulYelpCall(){
    console.log('Yelp call ran successfully');
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
  console.log($(this).attr('data-title'));
  //$('body').empty();
  newYorkTimesAjax($(this).attr('data-title'));
  findMovieID($(this).attr('data-id'));
  
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

    var addTrailerRow = $('<iframe>');
    addTrailerRow.addClass('youtubePlayer').attr('src', 'https://www.youtube.com/embed/' + movieTrailerID).attr('frameborder', '0').attr('allow', 'autoplay; encrypted-media').attr('allowfullscreen');
    $(".movieTrailer").empty();
    $(".movieTrailer").append(addTrailerRow);
    
{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/wVTIJBNBYoM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> */}
}