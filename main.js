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
    $('#submitButton').on('click', searchByLocation);
    $('.backButton').on('click', backButton);
    $('#navbarLogo').on('click',backButton);
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
}

function searchByLocation(){
    if($('#searchBar').val()){
        var location = $('#searchBar').val();
        getYelpData(location);
    } else {
        console.log('Please enter a location to search');
}}


function backButton(){
    $('.searchBarContainer').css('visibility', 'hidden');
    $('.search-bar-container').css('visibility', 'hidden');
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
    
    $(".movie-container").unbind().on('click', '.movieCardInfo', (event) => {
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
                movieUrl = "./noImage.jpg"
            } else {
                movieUrl = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
            }
            
            if (movie.vote_average === 0) {
                movie.vote_average = "N/A"
            } else {
                movie.vote_average
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
    // debugger
    if(searchText.length > 0){
        $('.movie-container').empty();
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=487eb0704123bb2cd56c706660e4bb4d&language=en-US&query=' + searchText + '&page=1&include_adult=false')
        .then((response) => {
            let movies = response.data.results;
            let output = '';
            $.each(movies, (index, movie) => {
                let movieUrl = "";
                //If no movie poster image use placeholder image
                if (movie.poster_path === null) {
                    movieUrl = "./noImage.jpg"
                } else {
                    movieUrl = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
                }

                if (movie.vote_average === 0) {
                    movie.vote_average = "N/A"
                } else {
                    movie.vote_average
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
    }
};

/****************************************************************************************************
 * getYelpData
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/

async function getYelpData(location) {
    console.log('get yelp data running');
    console.log('location: ',location);

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
        // location: location,
        // term: 'movie theater',
        success: successfulYelpCall

    }
    await $.ajax(yelpAjaxConfig);
}

/****************************************************************************************************
 * successfulYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call*/

function successfulYelpCall(response){
    console.log('successful yelp call');
    yelpResult = response.businesses;
    var yelpCoordinates = response.region.center;
    console.log(yelpCoordinates);
    initMap(yelpCoordinates);
}

/****************************************************************************************************
 * createMapMarkers
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call to pass Yelp object into function to create map markers*/

// function createMapMarkers(results){
//     var listings = results.businesses;
//     for (var i = 0; i < listings.length; i++) {
//         var coords = listings[i].coordinates;
//         var latLng = new google.maps.LatLng(coords['latitude'],coords['longitude']);
//         var image = {
//             url: 'http://chittagongit.com//images/movie-icon-vector/movie-icon-vector-9.jpg',
//             size: new google.maps.Size(20, 32),
//             origin: new google.maps.Point(0,0),
//             anchor: new google.maps.Pooint(0,32)
//         };

//         var shape = {
//             coords: [1, 1, 1, 20, 18, 20, 18, 1],
//             type: 'poly'
//           };
        
//         var marker = new google.maps.Marker({
//             position: latLng,
//             icon: image,
//             map: map,
//             shape: shape
// });}}

// async function addressCoordinates(){
//     var ajaxParams = {
//         url: "https://api.opencagedata.com/geocode/v1/json",
//         data: {
//             key: "52645efc693e4815825c94314f6d5f77",
//             q: $('.searchBar').val()
//             // q: 'Columbus, Ohio'
//         },
//         success: successfullAddressCoordinates
//     }  
//     await $.ajax(ajaxParams)
// }
// function successfullAddressCoordinates(responseCoordinates){
//     if(responseCoordinates.resluts !== undefined){
//         lat = responseCoordinates.results[0].geometry.lat;
//         lng = responseCoordinates.results[0].geometry.lng;
//         initMap(lat,lng);
//     }
// }

// var map;

function initMap(location) {
    console.log('initMap ran');
    var latitude = location.latitude;
    var longitude = location.longitude;
    var center = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center
    });
console.log('yelp result::', yelpResult);
    if(yelpResult){
        for(var i = 0; i < 10; i++){
            var image = {
                url:'./theater.png'
            }
            var coords = yelpResult[i].coordinates;
            var latLng = new google.maps.LatLng(coords['latitude'],coords['longitude']);	         

            var newMarker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: image,
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
//   await addressCoordinates();

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
    window.scrollTo(0,0)
     $('.poster').attr('src', someOfThis[0].firstElementChild.currentSrc)
    $('.starIcon').addClass("fas fa-star");
    $(".movieRatingData").text(' ' + someOfThis.attr('movieRating')+ ' / 10');
    $('#map').css('display', 'inline-block');
    $('.searchBarContainer').css('display', 'inline-block').css('visibility', 'visible');
    $('.search-bar-container').css('display', 'inline-block').css('visibility', 'visible');
    $('.movieTitle').text(someOfThis.attr('data-title'))
    $('.movieTrailer').append(addTrailerRow);
    $('.summary').text("Summary")
    $('.reviewTitle').text("Read the review")
    $('.searchNearby').text('Search Nearby Theaters');
    $('.mapOfTheaters').text('Nearby Theaters');
    $('.backButton').css('display', 'inline-block').text('Back').addClass('btn btn-danger');
    $('.movieSummary').append(summary);
    $('.nytReview').append(linkToReview);
    triggerModal();
  }

function progressBarUpdate() {
    $("#bar").width('100%');
        setTimeout(() => {$(".progress").css('display', 'none')}, 500);
}

var triggerModal = (function(){
    var executed = false;
    return function() {
        if(!executed){
            executed = true;
            $("#locationModal").modal();
            $("#enableGeolocation").on('click',enableGeolocation);
        }
    }
})();

function enableGeolocation(){
    $("#locationModal").modal('hide');
    if(navigator.geolocation){
        console.log('geolocation active')
        navigator.geolocation.getCurrentPosition(latLongCoordinates);
    } else {
        console.log('This browser does not support Geolocation.');
    }
}

function latLongCoordinates(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var coordinates = position.coords.latitude + ', ' + position.coords.longitude;
    getYelpData(coordinates);
    console.log('coordinates:', coordinates);
    // $('#searchBar').val('');
}

