const SEARCH = document.querySelector(".search");
const FORM = document.querySelector("#form");
const MAIN = document.querySelector("#section");
const POPULAR = document.querySelector("#popular");
const TOP_RATED = document.querySelector("#top-rated");
const NOW_SHOWING = document.querySelector("#now-playing");
const UPCOMING = document.querySelector("#upcoming");

const API_KEY = "fa30e22edc44fe4207fb5b197edf656e";
console.log(API_KEY);
const API_LINK =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=1";
const POPULAR_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
const TOP_RATED_API = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
const UPCOMING_API = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;
const NOW_PLAYING_API = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTMwZTIyZWRjNDRmZTQyMDdmYjViMTk3ZWRmNjU2ZSIsInN1YiI6IjY1YThkYmVhZjQ5NWVlMDEyZTQ2OGI2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jXOjCRGueiwmw2R3F7EwvtS-qby91SOv7NNESv7RyGM",
  },
};

const getMainMovie = function (url) {
  fetch(`${url}&api_key=${API_KEY}`, options)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((person) => {
        const knownForHTML = person.known_for
          .map((known) => {
            return `
            <div class="card">
              <img src="https://image.tmdb.org/t/p/w500${
                known.poster_path
              }" alt="${known.title}" />
              <p>Title: ${known.title || known.name}</p>
              <h4>Release date: ${known.release_date}</h4>
              <a href="" class="see-more">see more</a>
              <!-- Add other properties as needed -->
            </div>
          `;
          })
          .join("");

        MAIN.insertAdjacentHTML("afterbegin", knownForHTML);
      });
    })
    .catch((err) => console.error(err));
};

getMainMovie(API_LINK);

const getMovieBy = function (url) {
  fetch(url, options)
    .then((response) => {
      if(!response.ok) {
        throw new Error(`failed to fetch data ${response.status}`)
      }
      return response.json()})
    .then((data) => {
      if (!data) return;
      data.results.forEach((movie) => {
        const html = `
          <div class="row">
            <div class="column">
              <div class="card">
                <img src="${
                  movie && movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "./img/far-away.jpg"
                }" alt="poster of a movie" />
                <h3 style="flex-wrap: ${movie.title.length > 15 ? 'wrap' : 'nowrap'};">Title: ${movie.title}</h3>
                <h4>Release date: ${movie.release_date}</h4>
                <a href="" class="see-more">see more</a>
              </div>
            </div>
          </div>
        `;
        MAIN.insertAdjacentHTML("afterbegin", html);
      });
      console.log(data);
    })
    .catch((err) => console.error(err));
};

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  MAIN.innerHTML = "";
  const searchTerm = SEARCH.value.trim();

  if (searchTerm.length === 0 || searchTerm === "" || searchTerm === null) {
    MAIN.innerHTML = `
    <div class='error'>
      <i class="fa-regular fa-triangle-exclamation" style="color: #e93535;"></i>
      <p class='error-message'>💥 No results found</p>
    </div>
    `;
  }

  if (searchTerm !== "") {
    getMovieBy(SEARCH_API + encodeURIComponent(searchTerm));
  }
  SEARCH.value = "";
});

POPULAR.addEventListener("click", () => {
  MAIN.innerHTML = "";
  getMovieBy(POPULAR_API_URL);
});

TOP_RATED.addEventListener("click", () => {
  MAIN.innerHTML = "";
  getMovieBy(TOP_RATED_API);
});

NOW_SHOWING.addEventListener("click", () => {
  MAIN.innerHTML = "";
  getMovieBy(NOW_PLAYING_API);
});

UPCOMING.addEventListener("click", () => {
  MAIN.innerHTML = "";
  getMovieBy(UPCOMING_API);
});
