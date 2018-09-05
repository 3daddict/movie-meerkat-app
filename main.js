$(document).ready(initializeApp)

/****************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions*/
function initializeApp(){
    newYorkTimesAjax();
    
}




//has ajax paramaters
//@calls ajax new york times

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
    var linkToReview = items.map(items => $('<a>').text(items.link.url).attr('href', items.link.url));
    $('body').append(summary, linkToReview);
}



//what to do if it ajax gets error from server
//instead of appending synospsis and link to review apeends tecx that says they are unavailable at this time
function newYorkTimesAjaxError(){
  console.log('error NYT');
}



// * initializeApp
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
    console.log(response);
  });

    
}

