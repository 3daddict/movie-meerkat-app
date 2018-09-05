document.ready(initializeApp)

/****************************************************************************************************
* initializeApp
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions*/
function initializeApp(){
    getYelpData();
    
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
