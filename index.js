const SEARCH = document.querySelector(".search");
const FORM = document.querySelector("#form");
const MAIN = document.querySelector("#section");
const POPULAR = document.querySelector("#popular");
const TOP_RATED = document.querySelector("#top-rated");
const NOW_SHOWING = document.querySelector("#now-playing");
const UPCOMING = document.querySelector("#upcoming");

const API_KEY = "fa30e22edc44fe4207fb5b197edf656e";
const API_LINK =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=1";
const API_LINK1 =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=5";
const API_LINK2 =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=7";
const API_LINK3 =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=9";
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

const showSpinner = () => {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "block";
};

const hideSpinner = () => {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "none";
};

const getMainMovie = function (url) {
  showSpinner();
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
              <h4>Release date: ${
                known.release_date ? known.release_date : "Not available"
              }</h4>
              <a href="reviews.html?id=${known.id}&title=${
              known.title
            }" class="see-more" data-movie-id="${known.id}">see more</a>
              
            </div>
          `;
          })
          .join("");

        MAIN.insertAdjacentHTML("beforeend", knownForHTML);
      });
      const seeMoreLinks = document.querySelectorAll(".see-more");
      seeMoreLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          const movieId = this.dataset.movieId;
          // Navigate to the movie-details.html page with the movie ID as a query parameter
          window.location.href = `reviews.html?id=${movieId}`;
        });
      });
      hideSpinner();
    })
    .catch((err) => console.error(err));
};

getMainMovie(API_LINK);
getMainMovie(API_LINK1);
getMainMovie(API_LINK2);
// getMainMovie(API_LINK3);

const getMovieBy = function (url) {
  showSpinner();
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`failed to fetch data ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;

      if (!data || !Array.isArray(data.results) || data.results.length === 0) {
        hideSpinner();
        MAIN.innerHTML = `
    <div class='error'>
    <svg>
      <use href="./img/icons.svg#icon-alert-triangle"></use>
     </svg>
    <p class='error-message'>No results found</p>
    </div>
    `;
        return;
      }
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
                <h3>Title: ${movie.title}</h3>
                <h4>Release date: ${
                  movie && movie.release_date
                    ? movie.release_date
                    : "Not available"
                }</h4>
                <a href="reviews.html?id=${movie.id}&title=${
          movie.title
        }" class="see-more" data-movie-id="${movie.id}">see more</a>
              </div>
            </div>
          </div>
        `;
        MAIN.insertAdjacentHTML("beforeend", html);
      });

      const seeMoreLinks = document.querySelectorAll(".see-more");
      seeMoreLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          const movieId = this.dataset.movieId;
          // Navigate to the movie-details.html page with the movie ID as a query parameter
          window.location.href = `reviews.html?id=${movieId}`;
        });
      });
      console.log(data);
      hideSpinner();
    })
    .catch((err) => console.error(err));
};

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  MAIN.innerHTML = "";
  const searchTerm = SEARCH.value.trim();

  if (!searchTerm) {
    MAIN.innerHTML = `
    <div class="error">
      <svg>
        <use href="./img/icons.svg#icon-alert-triangle"></use>
      </svg>
      <p class='error-message'> Please enter a search term</p>
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

window.addEventListener("scroll", () => {
  const topNav = document.querySelector(".top-nav");
  const navLink = document.querySelector(".nav-link");
  const scrollHeight = window.pageYOffset;
  const navHeight = topNav.getBoundingClientRect().height;
  if (scrollHeight > navHeight) {
    topNav.classList.add("fixed-nav");
  } else {
    topNav.classList.remove("fixed-nav");
  }
  if (scrollHeight > 500) {
    navLink.classList.add("show-link");
  } else {
    navLink.classList.remove("show-link");
  }
});
