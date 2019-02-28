$(document).ready(initializeApp);

//Global Variables
var movieListings = [];
var summary;
var linkToReview;
var addTrailerRow;
var lat;
var lng;
var yelpResult;
var moviePagesLoaded = 4;
var titleOfMovie;
var reviewHeadline;
var reviewShort;
var releaseDate;
var infoWindowArray = [];

/** 
 * function that runs on document ready
 */
function initializeApp(){
    
    window.history.pushState({'type': 'home', 'value': 'home'},'Home','');
    addEventHandlers(); //runs click handler
    populateMovies();
    $("#bar").width(0);
    $('[data-toggle="tooltip"]').tooltip(); 
    window.addEventListener('popstate', e=> {
        backButton();
        switch(e.state.type){
            case 'home':
            populateMovies();
            break;
            case 'search':
            getMovies(e.state.value);
            break;
            case 'movie':
            clickHandlerToOpenNewPage(e.state.movieID);
            break;
        }
    })
}

/**
 * function that handles events
 */
function addEventHandlers(){
    $('#submitButton').on('click', ()=>{
        searchByLocation();
        $('.loadingImage').removeClass('d-none');
    });

    $('.backButton').on('click', ()=>{
        window.history.back();
        backButton();
    });

    $('#navbarLogo').on('click', ()=>{
        debugger;
        backButton();
        $('.loadScreen').addClass('d-none');
        $('.mainPage').removeClass('d-none');
    });

    $('#mobileSearchButton').on('click', () => {
        let searchText = $('#mobileSearchText').val();
        getMovies(searchText);
        $('#searchMovieModal').modal('hide');
        $('#mobileSearchText').val('');
    });

    $('#desktopSearchButton').on('click', () => {
        let searchText = $('#desktopSearchText').val();
        getMovies(searchText);
        $('#desktopSearchText').val('');
    });

    $('#magnifyButton').on('click',()=>{
        $('#searchMovieModal').modal();
    });

    $('#closeSearchButton').on('click',()=>{
        $('#searchMovieModal').modal('hide');
    });
}

/**
 * function that takes value of input for getYelpData function
 */
function searchByLocation(){
    if($('#searchBar').val()){
        var location = $('#searchBar').val();
        getYelpData(location);
    } else {
        console.log('Please enter a location to search');
}}

/**
 * function that runs once back button is pressed
 */
function backButton(){
    $('.backButton').addClass('d-none');
    $('#searchTheater').addClass('d-none');
    $('#searchBarGroup').addClass('d-none');
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
    $('.castContainer').empty();
    $('.castTitle').empty();
    $('.movieDetails').empty();
    $('.searchBarContainer').css('display', 'none');
    // $('.backButton').css('display','none');
    $('#map').css('display', 'none');
}

/**
 * function handle movie title clicks and call clickHandlerToOpenNewPage function on that id
 */
async function populateMovies(){
    getNowPlayingMovies();
    
    $('#searchBarGroup').addClass('d-none');
    $(".movie-container").off().on('click', '.movieCardInfo', (event) => {
        //find the closest parent id of clicked element in card
        // let movieRow = $(event.target).closest('.movieRow');
        let movieID = $(event.target).closest('.movieRow').attr('data-id');
        // let movieTitle = $(event.target).closest('.movieRow').attr('data-title');
        // let movieRow = $("div[data-title='"+movieTitle+"']");
        window.history.pushState({'type': 'movie', 'movieID':movieID},movieID, '');
        clickHandlerToOpenNewPage(movieID);
    });
}

/**
 * function that calls newYorkTimesAjax
 * @param {*} movieTitle
 */
async function newYorkTimesAjax (movieTitle){
    
    titleOfMovie = movieTitle.replace(/[‘’]+/g, '');
    var newYorkTimesParams = {
      url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json",
      method: 'GET',
      data: {
        'api-key': "EAJZJKpUWUaaG7GFAfAd00tnyinAFTIl",
          "query": movieTitle,
      },
    //   success: newYorkTimesAjaxSuccessful,
      error: newYorkTimesAjaxError,
    }
    await $.ajax( newYorkTimesParams ).then(newYorkTimesAjaxSuccessful);
}

/**
 * function that calls new york times review on success
 * @param {*} responseData
 */
function newYorkTimesAjaxSuccessful(responseData){
    titleOfMovie = titleOfMovie.replace(/[']+/g, '’');
    linkToReview = '';
    reviewHeadline = '';
    reviewShort = '';
    releaseDate = '';

    if(responseData.results[0] === undefined || titleOfMovie !== responseData.results[0].display_title){
        newYorkTimesAjaxError()
    } else {
        // summary = $('<div>').text(responseData.results[0].summary_short);
        linkToReview = responseData.results[0].link.url;
        reviewHeadline = responseData.results[0]['headline'].replace(/[‘’]+/g, '');
        reviewShort = responseData.results[0]['summary_short'];
        releaseDate = responseData.results[0]['opening_date'];
    }
}

/**
 * function that handles errors for newYorkTimesAjaxSuccessful
 */
function newYorkTimesAjaxError(){
  linkToReview = $('<div>').text('Unavailable');
  console.log('Error with newYorkTimes API');
//   summaryHeadline = $('<div>').text('Review unavailable');
//   summaryShort = $('<div>').text('');
//   summary = $('<a>').text('Summary not available for this movie');
}

/**
 * function to call tmdb api and populate now playing movies on dom
 */
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
                
                    <div class="card-img-top movie-image movieEffects" src="${movieUrl}" style="background-image: url(${movieUrl})"></div>
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
                            <h6 class="movieTitleCard">${movie.title}</h6>
                        </div>
                    </div>
                </div>
            </div>
            `
        });
        $(".movie-container").append(output);
        movieListings.push(movies);
        // progressBarUpdate();
        $('.loadScreen').addClass('d-none');
        $('.mainPage').removeClass('d-none');
    })
    .catch((err) => {
        console.log(err);
    });
}

/**
 * function to call tmdb api and populate movie titles with search value
 * @param {*} searchText
 */
function getMovies(searchText){
    $('#searchBarGroup').addClass('d-none');
    $('.loadScreen').removeClass('d-none');
    $('.mainPage').addClass('d-none');
    var textRegex = /^(?![ -'])(?!.*[ -']$)(?!.*[ -']{2})[a-zA-Z\d \-\'']{1,30}$/;
    var result = textRegex.test(searchText)

    if(result){
        window.history.pushState({'type': 'search', 'value': searchText},'search-'+ searchText,'');
        backButton();
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
            $('.loadScreen').addClass('d-none');
            $('.mainPage').removeClass('d-none');
        })
        .catch((err) => {
            console.log(err);
        });
    } else{
        $('.loadScreen').addClass('d-none');
        $('.mainPage').removeClass('d-none');
        $('#validationModal').modal();
    }
};

/**
 * function that runs the Yelp AJAX call to a proxy server that will communicate with Yelp
 * @param {*} location
 */
async function getYelpData(location) {
    // var yelpURL= "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location="+location+",%20ca&term=movie%20theater&sort_by=distance";
    var yelpURL = "yelp_proxy.php";
    //var yelpURL = "https:\/\/api.yelp.com/v3/businesses/search?term=movie theater&location="+location;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": yelpURL,
        "method": "POST",
         "headers": {
    "Authorization": "Bearer vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx",
    "cache-control": "no-cache"},
        "data": {
           location: location,
            api_key: "vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx"
        },
        success: successfulYelpCall,
        error: ()=>{
            console.log('yelp call failed');
        }
      }
      
      await $.ajax(settings);
}

/**
 * function runs during success of Yelp AJAX Call
 * @param {*} response
 */
function successfulYelpCall(response){
    response = JSON.parse(response);
    yelpResult = response.businesses;
    var yelpCoordinates = response.region.center;
    
    initMap(yelpCoordinates);
}

/**
 * function to initiate google maps and populate data
 * @param {*} location
 */
function initMap(location) {
    var latitude = location.latitude;
    var longitude = location.longitude;
    var center = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center
    });
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
                title: yelpResult['name']
            });

            function reviewStars(rating){
                rating = parseFloat(rating);
                var ratingClass = null;
                if(rating < 1){
                    ratingClass = 0;
                } else if( rating <= 1.5){
                    ratingClass = "rating-1-5";
                } else if( rating <= 2){
                    ratingClass = "rating-2";
                } else if( rating <= 2.5){
                    ratingClass = "rating-2-5";
                } else if( rating <= 3){
                    ratingClass = "rating-3";
                } else if( rating <= 3.5){
                    ratingClass = "rating-3-5";
                } else if( rating <= 4){
                    ratingClass = "rating-4";
                } else if( rating <= 4.5){
                    ratingClass = "rating-4-5";
                } else {
                    ratingClass = "rating-5";
                }
                return ratingClass
            }
            
            var ratingClass = reviewStars(yelpResult[i]['rating']);

            if(yelpResult[i]['name'].length > 33){
                yelpResult[i]['name'] = yelpResult[i]['name'].substring(0, 30) + '...';
            }

            if(!yelpResult[i]['name']){
                yelpResult[i]['name'] = "Unavailable";
            }

            if(!yelpResult[i]['location']['address1']){
                yelpResult[i]['location']['address1'] = 'Unavailable';
            }

            var contentString = 
            `<div class="infoWindow">
                <a class="headerLink" href="${yelpResult[i]['url']}" target="_blank">
                <h1 class="firstHeading" class="firstHeading">${yelpResult[i]['name']}</h1>
                </a>

                <div class="bodyContentImage">
                    <a class="headerLink" href="${yelpResult[i]['url']}" target="_blank">
                        <img class="infoImage" src="${yelpResult[i]['image_url']}" alt="Yelp Image">
                    </a>
                </div>

                <div class="bodyContent">
                    
                    <div class="starRating ${ratingClass}"></div>

                    <div class="reviewCount">
                        ${yelpResult[i]['review_count']} Reviews
                    </div>
                   
                    <div class="yelpAddress">
                        ${yelpResult[i]['location']['address1']}
                    </div>

                    <div class="yelpAddress2">
                        ${yelpResult[i]['location']['city']} ${yelpResult[i]['location']['state']}, ${yelpResult[i]['location']['zip_code']}
                    </div>
                    <div class="infoYelpLink">
                        <a href="${yelpResult[i]['url']}" target="_blank">View Yelp Page</a> 
                    </div>
                </div>

                </div>


            `;

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 300,
                maxHeight: 100
            });
            infoWindowArray.push(infowindow);

            (function(marker, infowindow) {
                marker.addListener('click', function () {
                    clearInfoWindows();
                    infowindow.open(map, marker);
                });
            })(newMarker, infowindow);
    }
    
    google.maps.event.addListener(map, 'click', function(){
        clearInfoWindows();
    });
    $('.loadingImage').addClass('d-none');
}}


/**
 * function to open an new page with the movie clicked and populate data
 * @param {*} movieRow
 * @param {*} movieID
 * @param {*} movieTitle
 */
async function clickHandlerToOpenNewPage(movieID){
    $('.loadScreen').removeClass('d-none');
    $('.mainPage').addClass('d-none');
    var movieRow = $("div[data-id='"+movieID+"']");
    var movieTitle = $("div[data-id='"+movieID+"']").attr('data-title');

  $('.movieRow').remove();
  await findMovieID(movieID);
  await getDetails(movieID);
  await newYorkTimesAjax(movieTitle)
  await dynamicallyCreateMovieInfoPage(movieRow);
  await getActors(movieID);
//   await addressCoordinates();

}

/**
 * function to find the clicked movies tmdb ID and run dynamicYoutubeVideo with ID
 * @param {*} tmdbID
 */
function findMovieID(tmdbID){
    var settings =  {
        "async": true,
        "crossDomain": true,
        "url": "https://api.themoviedb.org/3/movie/" + tmdbID + "/videos?language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
        "method": "GET",
        "headers": {},
        "data": "{}",
        "error": ()=>{
            console.log('error with themoviedb API');
        }
    }
  
  $.ajax(settings).done(function (response) {
      var trailerID = null;
      for(var i = 0; i < response.results.length; i++){
        if(response.results[i].type == 'Trailer'){
        trailerID = response.results[i].key;
        break;
      } else {
          trailerID = response.results[0].key;
      }}
    dynamicYoutubeVideo(trailerID);
  });
}

/**
 * function that creates the youtibe movie trailer and inserts on the dom
 * @param {*} movieTrailerID
 */
function dynamicYoutubeVideo(movieTrailerID) {
    $('.movieTrailer').empty();
    $('.movieTrailer').append(`<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/${movieTrailerID}?controls=0' frameborder='0' allowfullscreen></iframe></div>`);
}


/**
 * function that creates movie page elements for dom
 * @param {*} someOfThis
 */
function dynamicallyCreateMovieInfoPage(someOfThis){
    
    window.scrollTo(0,0)
    $('#searchBarGroup').removeClass('d-none');
    $('.backButton').removeClass('d-none');
    $('#searchTheater').removeClass('d-none');
     $('.poster').attr('src', someOfThis[0].firstElementChild.attributes.src.value);
    $('.starIcon').addClass("fas fa-star");
    $(".movieRatingData").text(' ' + someOfThis.attr('movieRating')+ ' / 10');
    $('#map').css('display', 'inline-block');
    $('.searchBarContainer').css('display', 'inline-block').css('visibility', 'visible');
    $('.search-bar-container').css('display', 'inline-block').css('visibility', 'visible');
    $('.movieTitle').text(someOfThis.attr('data-title'))
    $('.movieTrailer').append(addTrailerRow);
    // $('.summary').text("Summary")
    $('.castTitle').text('Cast');
    $('.searchNearby').text('Search Nearby Theaters');
    $('.mapOfTheaters').text('Nearby Theaters');
    // $('.backButton').css('display', 'inline-block').text('Back').addClass('btn btn-danger');
    // $('.movieSummary').append(summary);
   
    if(reviewShort){
        $('.nytReview').text(reviewShort);
    } else {
        $('.nytReview').text('Unavailable');
    }


    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var release = new Date(releaseDate + ' 00:00');
    var longDate = monthNames[release.getMonth()] + ' ' + release.getDate() + ', ' + release.getFullYear();
    if(!monthNames[release.getMonth()]){
        longDate = 'Unavailable';
    }

    $('.releaseDate').text(longDate);

    $('.reviewTitle').removeClass('d-none');
    if(!linkToReview){
        $('.reviewTitle').addClass('d-none');
    } else{
        $('.reviewTitle').text(reviewHeadline);
    }

    $('.reviewTitle').attr('href', linkToReview).attr('target', "_blank");
    $('.loadScreen').addClass('d-none');
    $('.mainPage').removeClass('d-none');
    triggerModal();
}

/**
 * function to create and run the bootstrap progress bar
 */
// function progressBarUpdate() {
//     $("#bar").width('100%');
//         setTimeout(() => {$(".progress").css('display', 'none')}, 500);
// }

/**
 * function to trigger modal
 * @returns modal
 */
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

/**
 * function to hide modal and use geolocation or send error
 */
function enableGeolocation(){
    $("#locationModal").modal('hide');
    $('.loadingImage').removeClass('d-none');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(latLongCoordinates);
    } else {
        console.log('This browser does not support Geolocation.');
        $('.loadingImage').addClass('d-none');
    }
}

/**
 * function that takes coordinates and runs the getYelpData function to generate map
 * @param {*} position
 */
function latLongCoordinates(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var coordinates = position.coords.latitude + ', ' + position.coords.longitude;
    coordinatesToZipcode(coordinates);
}

/**
 * function to call tmdb and find actors of movie id
 * @param {*} movieID
 */
function getActors(movieID){
    if(movieID){
        //marker
        $('.movie-container').empty();
        axios.get('https://api.themoviedb.org/3/movie/' + movieID + '/credits?api_key=487eb0704123bb2cd56c706660e4bb4d')
        .then((response) => {
            const limit = {actors: 6};

            if($(window).width() > 1199){
                limit['actors'] = 10;
            } else if($(window).width() > 991){
                limit['actors'] = 8;
            }

            for(let i = 0; i < limit['actors']; i++){
                let actor = response.data.cast[i]['name'];
                let character = response.data.cast[i]['character'];
                let actorImage = response.data.cast[i]['profile_path'];
                if(actorImage){
                    actorImage = "https://image.tmdb.org/t/p/original/" + actorImage;
                } else {
                    actorImage = "noImage.jpg";
                }
                
                let output = `
                <div class="col">
			        <figure class="figure castMember text-center">
				        <img src="${actorImage}" class="figure-img img-fluid rounded castImg" alt="${actor}">
                        <figcaption class="figure-caption actorName">
                            <a data-toggle="tooltip" data-placement="top" title="${actor}">${actor}</a>
                            <span class="characterName">
                                <a data-toggle="tooltip" data-placement="top" title="${character}">${character}</a>
                            </span>
                        </figcaption>
			        </figure>
		        </div>
                `;

                $('.castContainer').append(output);

            }
            
            $('.loadScreen').addClass('d-none');
            $('.mainPage').removeClass('d-none');
})}};

/**
 * function to call tmdb and find actors of movie id
 * @param {*} movieID
 */
function getDetails(movieID){
    if(movieID){
        axios.get('https://api.themoviedb.org/3/movie/' + movieID + '?api_key=487eb0704123bb2cd56c706660e4bb4d')
        .then((response) => {
            summary = $('<div>').text(response.data.overview);
            let overview = response.data.overview;

            
            let budget = response.data.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if(budget < 1){
                budget = 'Unavailable';
            } else {
                budget = '$' + budget;
            }
            const genre = [];
            for(let i = 0; i < response.data.genres.length; i++){
                genre.push(response.data.genres[i].name);
            }

            let genreList = genre.join(', ');
            let runtimeHrs = Math.floor(response.data.runtime / 60);
            let runtimeMin = response.data.runtime % 60;
            let runtime = `${runtimeHrs}h ${runtimeMin}min`;

            let output = `
                <div class="col">
                    <div class="movieDetailsContainer">
                        <div>Release Date</div>
                        <div class="releaseDate"></div>
                    </div>
                    <div class="movieDetailsContainer">
                        <div>Overview</div>
                        <div class="overview">${overview}</div>
                    </div>
                    <div class="movieDetailsContainer">
                        <div>Genre</div>
                        <div class="genre">${genreList}</div>
                    </div>    
                    <div class="movieDetailsContainer">
                        <div>Runtime</div>
                        <div class="runtime">${runtime}</div>
                    </div>
                    <div class="movieDetailsContainer">
                        <div>Budget</div>
                        <div class="budget">${budget}</div>
                    </div>
                    <div class="movieDetailsContainer">
                        <div>New York Times Review</div>
                        <a class="reviewTitle"></a>
                        <div class="nytReview"></div>
                    </div>

		        </div>
                `;
                $('.movieDetails').append(output);
            })}}

/**
 * function that opens search modal
 */
function openSearchModal(){
    $('#searchMovieModal').modal();
}

/**
 * function that gets the zipcode of user if geolocation was enabled by user
 */
function coordinatesToZipcode(location){
    var ajaxParams = {
        url: "https://api.opencagedata.com/geocode/v1/json",
        method: 'get',
        data: {
            key: "52645efc693e4815825c94314f6d5f77",
            q: location
        },
        error: ()=>{
            console.log('Error with Opencagedata API');
        }
    }  
    $.ajax(ajaxParams).then((response)=>{
        getYelpData(response.results[0].components.postcode);
    });
}

/**
 * function that clears all open info windows
 */
function clearInfoWindows(){
    for(var i = 0; i < infoWindowArray.length; i++){
        infoWindowArray[i].close();
    }
}
