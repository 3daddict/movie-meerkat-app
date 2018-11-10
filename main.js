$(document).ready(initializeApp)

function initializeApp(){
    clickHandler(); //runs click handler
    populateMovies();
    $("#bar").width(0);
}
/****************************************************************************************************
 * clickHandler
 * @params {undefined} none
 * @returns: {undefined} none
 * Attaches click handler to run different functions when clicking on their respective buttons*/

function clickHandler(){
    $('#submitButton').on('click', getYelpData);
    $('.backButton').on('click', backButton);
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
}

function backButton(){
    $('#searchBarContainer').css('display', 'none');
    $('.poster').removeAttr('src');
    $('.starIcon').removeClass("fas fa-star");
    $('.searchNearby').empty();
    $('.mapOfTheaters').empty();
    $('.movieRatingData').empty();
    $('.movieTitle').empty();
    $('.movieTrailer').empty();
    $('.summary').empty();
    $('.reviewTitle').empty();
    $('.movieSummary').empty();
    $('.nytReview').empty();
    $('.searchBarContainer').css('display', 'none');
    $('.backButton').css('display','none');
    $('#map').css('display', 'none');
    populateMovies();
}

async function populateMovies(){
    getNowPlayingMovies();
    
    $(".movie-container").on('click', '.movieCardInfo', (event) => {
        //find the closest parent id of clicked element in card
        let movieRow = $(event.target).closest('.movieRow');
        let movieID = $(event.target).closest('.movieRow').attr('data-id');
        let movieTitle = $(event.target).closest('.movieRow').attr('data-title');
        console.log('data-id:', movieID);
        console.log('data-title:', movieTitle);
        clickHandlerToOpenNewPage(movieRow, movieID, movieTitle);
    });
}

//Global Variables
var movieListings = [];
var summary;
var linkToReview;
var addTrailerRow;
var lat;
var lng;
var yelpResult;
var moviePagesLoaded = 4;

//has ajax paramaters
//@calls ajax new york times
//@params called query value is movie title
var titleOfMovie = null;
async function newYorkTimesAjax (movieTitle){
    titleOfMovie = movieTitle;
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
    await $.ajax( newYorkTimesParams );
}

// * @params responseData
// * returns link and summary for movie
function newYorkTimesAjaxSuccessful(responseData){
    if(responseData.results[0] === undefined || titleOfMovie !== responseData.results[0].display_title){
        newYorkTimesAjaxError()
    }else{
        summary = $('<div>').text(responseData.results[0].summary_short);
        linkToReview = $('<a>').text(responseData.results[0].link.url).attr('href', responseData.results[0].link.url).attr('target', "_blank");
    }
}

// * @returns appends text that says they are unavailable at this time
function newYorkTimesAjaxError(){
  linkToReview = $('<div>').text('Link not available for this movie');
  summary = $('<a>').text('Summary not available for this movie');
}

/******************************************
* Function to call tmdb api and populate now playing movies on dom
******************************************/

function getNowPlayingMovies(){
    
    $('.movie-container').empty();
    axios.get('https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d')
    .then((response) => {
        
        let movies = response.data.results;
        let output = '';
        $.each(movies, (index, movie) => {
            let movieUrl = "";
            //If no movie poster image use placeholder image
            if (movie.poster_path === null) {
                movieUrl = "./noImage.png"
            } else {
                movieUrl = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
            }

            //format the release date to year
            let releaseYear = movie.release_date.slice(0, -6);

            output += `
            <div class="col">
                <div class="card movieRow" data-title="${movie.title}" data-id="${movie.id}" movierating="${movie.vote_average}">
                    <img class="card-img-top movie-image movieEffects" src="${movieUrl}">
                    <div class="card-body movie-content movieCardInfo" id="${movie.id}">
                        <div class="row align-items-start">
                            <div class="col">
                                <button class="btn btn-outline-warning btn-sm movieRating" id="imdbBtn">IMDb ${movie.vote_average}</button>
                            </div>
                            <div class="col">
                                <div class="realease-date pull-right text-right"><span>${releaseYear}</span></div>
                            </div>
                        </div>
                        <div class="row justify-content-center mt-5">
                            <h6 class="movieTitle">${movie.title}</h6>
                        </div>
                    </div>
                </div>
            </div>
            `
        });
        $(".movie-container").append(output);
        movieListings.push(movies);
        console.log("movieListings: ", movieListings);
        progressBarUpdate();
    })
    .catch((err) => {
        console.log(err);
    });
}

/******************************************
* Function to call tmdb api and populate movie titles with search value
******************************************/

function getMovies(searchText){
    // debugger;
    $('.movie-container').empty();
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=487eb0704123bb2cd56c706660e4bb4d&language=en-US&query=' + searchText + '&page=1&include_adult=false')
    .then((response) => {
        
        let movies = response.data.results;
        let output = '';
        $.each(movies, (index, movie) => {
            let movieUrl = "";
            //If no movie poster image use placeholder image
            if (movie.poster_path === null) {
                movieUrl = "./noImage.png"
            } else {
                movieUrl = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
            }

            //format the release date to year
            let releaseYear = movie.release_date.slice(0, -6);

            output += `
            <div class="col">
                <div class="card movieRow" data-title="${movie.title}" data-id="${movie.id}" movierating="${movie.vote_average}">
                    <img class="card-img-top movie-image movieEffects" src="${movieUrl}">
                    <div class="card-body movie-content movieCardInfo" id="${movie.id}">
                        <div class="row align-items-start">
                            <div class="col">
                                <button class="btn btn-outline-warning btn-sm movieRating" id="imdbBtn">IMDb ${movie.vote_average}</button>
                            </div>
                            <div class="col">
                                <div class="realease-date pull-right text-right"><span>${releaseYear}</span></div>
                            </div>
                        </div>
                        <div class="row justify-content-center mt-5">
                            <h6 class="movieTitle">${movie.title}</h6>
                        </div>
                    </div>
                </div>
            </div>
            `
        });
        $(".movie-container").append(output);
        movieListings = [];
        movieListings.push(movies);
    })
    .catch((err) => {
        console.log(err);
    });
};

/****************************************************************************************************
 * getYelpData
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/

async function getYelpData() {
    var location = $('#searchBar').val();
    var yelpAjaxConfig = {
        dataType: 'json',
        url: 'https://yelp.ongandy.com/businesses',
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

    }
    await $.ajax(yelpAjaxConfig);
}

/****************************************************************************************************
 * successfulYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call*/

function successfulYelpCall(response){
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

async function addressCoordinates(){
    var ajaxParams = {
        url: "https://api.opencagedata.com/geocode/v1/json",
        data: {
            key: "52645efc693e4815825c94314f6d5f77",
            q: $('.searchBar').val()
            // q: 'Columbus, Ohio'
        },
        success: successfullAddressCoordinates
    }  
    await $.ajax(ajaxParams)
}
function successfullAddressCoordinates(responseCoordinates){
    if(responseCoordinates.resluts !== undefined){
        lat = responseCoordinates.results[0].geometry.lat;
        lng = responseCoordinates.results[0].geometry.lng;
        initMap(lat,lng);
    }
}

var map;
function initMap() {
    var learningFuze = {lat: 33.634857, lng: -117.74044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: learningFuze
    });

    // var contentString = '<div id="content">' +
    //     '<div id="siteNotice">' +
    //     '</div>' +
    //     '<h1 id="firstHeading" class="firstHeading">Theater Name</h1>' +
    //     '<div id="bodyContent">' +
    //     '</div>' +
    //     '</div>';

    // var infowindow = new google.maps.InfoWindow({
    //     content: contentString,
    //     maxWidth: 250,
    //     maxHeight: 100
    // });

    // var marker = new google.maps.Marker({
    //     position: learningFuze,
    //     map: map,
    //     title: 'LearningFuze'
    // });

    // marker.addListener('click', function () {
    //     infowindow.open(map, marker);
    // });
    if(yelpResult !== undefined){
        for(var i = 0; i < 10; i++){
            var position = {lat: yelpResult[i]['coordinates']['latitude'], lng: yelpResult[i]['coordinates']['longitude']};
            var newMarker = new google.maps.Marker({
                position: position,
                map: map,
                title: yelpResult['name'], 
            });
            var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + yelpResult[i]['name'] + '</h1>' +
            '<div id="bodyContent">' +
            '</div>' +
            '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 250,
                maxHeight: 100
            });
            // var marker = new google.maps.Marker({
            //     position: learningFuze,
            //     map: map,
            //     title: yelpResult['name']
            // });
    
            (function(marker, infowindow) {
                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
            })(newMarker, infowindow);
    }
    
}}


async function clickHandlerToOpenNewPage(movieRow, movieID, movieTitle){
  $('.movieRow').remove();
  await findMovieID(movieID);
  await newYorkTimesAjax(movieTitle)
  await dynamicallyCreateMovieInfoPage(movieRow);
  await addressCoordinates();

}

/****************************************************************************************************
 * YouTubeApi
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/
function findMovieID(tmdbID){
var settings =  {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/" + tmdbID + "/videos?language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
    dynamicYoutubeVideo(response.results[0].key);
  });
}

/****************************************************************************************************
 * 
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/

function dynamicYoutubeVideo(movieTrailerID) {
    $('.movieTrailer').empty();
    $('.movieTrailer').append(`<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/${movieTrailerID}?controls=0' frameborder='0' allowfullscreen></iframe></div>`);
}


function dynamicallyCreateMovieInfoPage(someOfThis){
     $('.poster').attr('src', someOfThis[0].firstElementChild.currentSrc)
    $('.starIcon').addClass("fas fa-star");
    $(".movieRatingData").text(' ' + someOfThis.attr('movieRating')+ ' / 10');
    $('#map').css('display', 'inline-block');
    $('.searchBarContainer').css('display', 'inline-block');
    $('.movieTitle').text(someOfThis.attr('data-title'))
    $('.movieTrailer').append(addTrailerRow);
    $('.summary').text("Summary")
    $('.reviewTitle').text("Read the review")
    $('.searchNearby').text('Search Nearby Theaters');
    $('.mapOfTheaters').text('Nearby Theaters');
    $('.backButton').css('display', 'inline-block').text('Back').addClass('btn btn-danger');
    $('.movieSummary').append(summary);
    $('.nytReview').append(linkToReview);

  }

function progressBarUpdate() {
    $("#bar").width('100%');
        setTimeout(() => {$(".progress").css('display', 'none')}, 500);
}