$(document).ready(initializeApp)

/****************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions*/
function initializeApp(){
    console.log('Initialized App');
    movieListingsOnDOM(); //appends movies to the dom
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
}





//Global Variables
var movieListings = [];


//has ajax paramaters
//@calls ajax new york times
//@params called query value is movie title
function newYorkTimesAjax (){
    var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
    url += '?' + $.param({
      'api-key': "8f55164da30c48c9ba4dc79d9fce1827"
    });
    $.ajax({
      url: url,
      method: 'GET',
      success: newYorkTimesAjaxSuccessful,
      error: newYorkTimesAjaxError,
    })
    
    

    $.ajax( url);
}

//what to do if ajax fires successfully
//finds the synopsis of the movie and appends it to the trailer
//finds the link to the whole review and appends it as well

function newYorkTimesAjaxSuccessful(responseData){
    console.log("responseData:", responseData);
    var items = responseData.results
    var summary = items.map(items => $('<div>').text(items.summary_short));
    //var linkToReview = items.map(items => $('<a>').text(items.link.url).attr('href', items.link.url));
    //$('body').append(summary, linkToReview);
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

        var addMovieRow = $('<div>').addClass('movieRow');
        $('.movieRow').on('click', function(){
          location.href = "movie.html"
        })
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
