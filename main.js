$(document).ready(initializeApp)

/****************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions*/
function initializeApp(){

    
}




//has ajax paramaters
//@calls ajax new york times

function newYorkTimesAjax (){

}

//what to do if ajax fires successfully
//finds the synopsis of the movie and appends it to the trailer
//finds the link to the whole review and appends it as well

function newYorkTimesAjaxSuccessful(){

}



//what to do if it ajax gets error from server
//instead of appending synospsis and link to review apeends tecx that says they are unavailable at this time
function newYorkTimesAjaxError(){

}


/****************************************************************************************************
* initializeApp
* @param  {} settings
* @param  {} .done(function(response))
* @returns: {response} 
* calls the the movie database API*/

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