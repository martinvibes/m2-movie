const SEARCH = document.querySelector(".search");
const SEARCH_ICON = document.querySelector(".s-icon");
const FORM = document.querySelector("#form");
const MAIN = document.querySelector("#section");
const POPULAR = document.querySelector("#popular");
const TOP_RATED = document.querySelector("#top-rated");
const NOW_SHOWING = document.querySelector("#now-playing");
const UPCOMING = document.querySelector("#upcoming");
const pagination = document.querySelector(".pagination");

const API_KEY = "fa30e22edc44fe4207fb5b197edf656e";
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

let curPage = 1;
const getMainMovie = function (url) {
  showSpinner();
  const API_LINK = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${curPage}&api_key=${API_KEY}`;

  fetch(API_LINK, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch movies", response.status);
      }

      return response.json();
    })
    .then((data) => {
      if (!data) return;

      data.results.forEach((person) => {
        const knownForHTML = person.known_for
          .map((known) => {
            return `
            <div class="card">
            <img src="${
              person && known.poster_path
                ? `https://image.tmdb.org/t/p/w500${known.poster_path}`
                : "./img/far-away.jpg"
            }" alt="${known.title}" />
              <p>Title: ${
                known.title && known.title.split(" ").length > 20
                  ? known.title
                  : known.title && known.title.length > 20
                  ? known.title.substring(0, 20) + "..."
                  : known.title || known.name
              }</p>
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
          const currentPageUrl = window.location.href;
          localStorage.setItem("selectedMovieId", movieId);
          localStorage.setItem("currentPageUrl", currentPageUrl);
          window.location.href = `reviews.html?id=${movieId}`;
        });
      });

      //  prevButton.style.display = "inline-block";
      //  nextButton.style.display = "inline-block";

      updatePaginationButtons();
      hideSpinner();
    })
    .catch((err) => {
      console.error(err);
    });
};

const prevButton = document.querySelector(".pagination-prev");
const nextButton = document.querySelector(".pagination-next");
const prev_page_number = document.querySelector(".prev");
const next_page_number = document.querySelector(".next");

// Function to update pagination buttons based on current page
const updatePaginationButtons = () => {
  prev_page_number.textContent = curPage - 1;
  next_page_number.textContent = curPage + 1;

  // If current page is 1, only show next button
  if (curPage === 1) {
    pagination.classList.add("see_pagination");
    nextButton.style.display = "inline-block";
  }
  // If current page is greater than 1 and not the last page, show both buttons
  else if (curPage > 1 && curPage < 100) {
    prevButton.style.display = "inline-block";
    nextButton.style.display = "inline-block";
  }
  // If current page is the last page, show only prev button
  else if (curPage === 100) {
    prevButton.style.display = "inline-block";
  }
};

// Function to handle next page click
const nextPageClick = () => {
  MAIN.innerHTML = "";
  curPage++;
  console.log(curPage);
  getMainMovie(curPage);
  updatePaginationButtons();
};

// Function to handle previous page click
const prevPageClick = () => {
  if (curPage > 1) {
    MAIN.innerHTML = "";
    curPage--;
    console.log(curPage);
    getMainMovie(curPage);
    updatePaginationButtons();
  }
};

getMainMovie(curPage);
// Event listeners for pagination buttons
prevButton.addEventListener("click", prevPageClick);
nextButton.addEventListener("click", nextPageClick);

const getMovieBy = function (url) {
  pagination.style.display = "none";
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
        MAIN.innerHTML = "";
        hideSpinner();
        pagination.style.display = "none";
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
                <h3>Title: ${
                  movie.title && movie.title.split(" ").length > 20
                    ? movie.title
                    : movie.title && movie.title.length > 20
                    ? movie.title.substring(0, 20) + "..."
                    : movie.title || movie.name
                }</h3>
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
          const currentPageUrl = window.location.href;
          localStorage.setItem("selectedMovieId", movieId);
          localStorage.setItem("currentPageUrl", currentPageUrl);
          window.location.href = `reviews.html?id=${movieId}`;
        });
      });
      console.log(data);
      hideSpinner();
    })
    .catch((err) => console.error(err));
};

const summitSearch = (e) => {
  e.preventDefault();
  MAIN.innerHTML = "";
  const searchTerm = SEARCH.value.trim();

  if (!searchTerm) {
    MAIN.innerHTML = "";
    pagination.style.display = "none";
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
};

FORM.addEventListener("submit", summitSearch);
SEARCH_ICON.addEventListener("click", summitSearch);

// const searchTerm = SEARCH.value;
// const suggestion = function (value) {
//   fetch(
//     `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=${value}`
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       const datalist = document.getElementById("suggestions");
//       // data.results.forEach((suggest) => {
//       //   const option = document.createElement("option");
//       //   option.value = suggest.title;
//       //   datalist.appendChild(option);
//       // });
//       // console.log(data);

//       // part 2
//       const results = data.results.filter((search) => {
//         // return (
//         //   value &&
//         //   search &&
//         //   search.title &&
//         //   search.title.toLowerCase().includes(value)
//         // );
//         console.log(search);
//       });
//       console.log(results);
//     })
//     .catch((err) => console.log(err));
// };

// SEARCH.addEventListener("input", () => {
//   suggestion(searchTerm);
// });

const suggestion = async function (value) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=${value}`
    );
    const data = await response.json();

    const datalist = document.getElementById("suggestions");
    // Clear previous suggestions
    datalist.innerHTML = "";
    data.results.forEach((suggest) => {
      const option = document.createElement("option");
      option.value = suggest.title;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
};

SEARCH.addEventListener("input", () => {
  const searchTerm = SEARCH.value.trim();
  suggestion(searchTerm);
});

POPULAR.addEventListener("click", () => {
  nextButton.style.display = "none";
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
