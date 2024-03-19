const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const title = urlParams.get("title");
const trailerUrl = urlParams.get("trailerUrl");

// Populate the title and iframe source
document.getElementById("trailer-title").textContent = title + " Trailer";
document.getElementById("trailer-iframe").src = decodeURIComponent(trailerUrl);
