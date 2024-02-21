document.addEventListener("DOMContentLoaded", function () {
  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  // Get movie ID from URL
  const movieId = getUrlParameter("id");
  if (!movieId) {
    console.error(`movieId is not found in the URL`);
    return;
  }

  const apiKey = "fa30e22edc44fe4207fb5b197edf656e";
  const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`failed to fetch movieDetails ${response.status}`);
      }
      return response.json();
    })
    .then((movieDetails) => {
      console.log(movieDetails);
      // Display movie details on the page
      const detailsContainer = document.getElementById("section");
      detailsContainer.innerHTML = `
             
           <div class="reviews-page">
               <div class="card">
                 <img src="${
                   movieDetails && movieDetails.poster_path
                     ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                     : "./img/image-not-found.png"
                 }" alt="poster of a movie" />
                 <h3><span>Title:</span> ${movieDetails.title}</h3>
                 </div>
                 
                 <div class="reviews">
               <h1><u> OverView </u></h1>
               <p>${movieDetails.overview}</p>
               <h4><span>Release Date:</span> ${
                 movieDetails && movieDetails.release_date
                   ? movieDetails.release_date
                   : "Not available"
               }</h4>
               <h4><span>Spoken Languages:</span> ${movieDetails.spoken_languages.map(
                 (lang) => {
                  return [lang.name, lang.iso_639_1].join(', ')
                }
               )}</h4>
               <h4><span>Video:</span> ${movieDetails.video}</h4>
               <h4><span>Genres:</span> ${movieDetails.genres
                 .map((genre) => genre.name)
                 .join(", ")}</h4>
               <h4><span>Status:</span> ${movieDetails.status}</h4>
               <h4><span>Runtime:</span> ${Math.trunc(
                 movieDetails.runtime / 60
               )}h ${movieDetails.runtime % 60}min</h4>
               <h4><span>Is movie for adult:</span> ${
                 !movieDetails.adult ? "for all age" : movieDetails.adult
               }</h4>
               <h4><span>Production companies:</span> ${movieDetails.production_companies
                 .map((comp) => comp.name)
                 .join(", ")}</h4>
               <h4><a href="${movieDetails.homepage}" target="_blank">Link to the site</a></h4>
               
           </div>
          </div>
          `;
    })
    .catch((error) => {
      console.error(error);
      alert(error.message, error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    const selectedMovieId = localStorage.getItem('selectedMovieId');
    const currentPageUrl = localStorage.getItem('currentPageUrl');
    if (currentPageUrl && selectedMovieId) {
      window.location.href = currentPageUrl;
      localStorage.removeItem('selectedMovieId');
      localStorage.removeItem('currentPageUrl');
      setTimeout(() => {
        const selectedMovieSeeMore = document.querySelector(`.see-more[data-movie-id="${selectedMovieId}"]`);
        if (selectedMovieSeeMore) {
          selectedMovieSeeMore.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000); // Adjust delay as needed
    }
  });
});
