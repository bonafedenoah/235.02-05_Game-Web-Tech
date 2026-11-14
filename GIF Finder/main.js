window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    
    document.querySelector("#searchterm").onkeypress = (e) => {
        if(e.key === "Enter"){
            searchButtonClicked();
        }
    };
};

let displayTerm = "";

function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    const GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";
    let url = "https://api.giphy.com/v1/gifs/search?";
    url += `api_key=${GIPHY_KEY}`;

    let term = document.querySelector("#searchterm").value;
    term = term.trim();
    term = encodeURIComponent(term);

    if(term.length < 1){
        return;
    }

    url += `&q=${term}`;

    let limit = document.querySelector("#limit").value;
    url += `&limit=${limit}`;

    displayTerm = term;
    console.log("Constructed URL:", url);

    getData(url);
}

function getData(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", url, true);
    xhr.send();
}

function dataLoaded(e){
    let xhr = e.target;
    console.log("Raw JSON response:", xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if(!obj.data || obj.data.length == 0){
        document.querySelector("#content").innerHTML = "<p><i>No results found!</i></p>";
        document.querySelector("#status").innerHTML = `<b>No results found for '${displayTerm}'</b>`;
        return;
    }

    let bigString = "";

    for(let i = 0; i < obj.data.length; i++){
        let result = obj.data[i];
        let smallURL = result.images.fixed_height_small.url;
        let gurl = result.url;
        let rating = result.rating ? result.rating.toUpperCase() : "NR"; // Rating fallback

        let line = `<div class='result'>
            <span><a href='${gurl}' target='_blank'>View on Giphy</a></span>
            <span class='rating'>Rating: ${rating}</span>
            <img src='${smallURL}' alt='GIF'/>
        </div>`;

        bigString += line;
    }

    document.querySelector("#content").innerHTML = bigString;
    document.querySelector("#status").innerHTML = `<b>Success!</b> Showing results for '${displayTerm}'`;
}

function dataError(e){
    console.log("An error occurred!");
    document.querySelector("#status").innerHTML = "<b>Error downloading data!</b>";
}