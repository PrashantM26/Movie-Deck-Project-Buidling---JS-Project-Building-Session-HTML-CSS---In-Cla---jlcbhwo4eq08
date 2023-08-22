let pageNumber;
let totalPages = 0;
let currentState = "desc";
let currentStateDate = "primary_release_date.desc"
let currentTab = "all";
let searchMode = false;

const movieListSection = document.querySelector("#movie-list");
const nextBtn = document.querySelector("#next");
const backBtn = document.querySelector("#prev");
const pageNumberContainer = document.querySelector("#page-no");
const ratingToggle = document.querySelector("#rating-toggle");
const searchInput = document.querySelector("#search-bar-input");
const searchBtn = document.querySelector("#search-bar-button");
const sortByDate = document.querySelector("#sort-by-date");
const allMoviesTab = document.querySelector("#allMoviesTab");
const favoriteTab = document.querySelector("#favoritesTab");

const SORT_ASC_TEXT = "Sort by rating (most to least)";
const SORT_DESC_TEXT = "Sort by rating (least to most)";
const SORT_ASC_DATE_TEXT = "Sort by date (latest to oldest)";
const SORT_DESC_DATE_TEXT = "Sort by date (oldest to latest)";

let SORT_ASC = "popularity.asc";
let SORT_DESC = "popularity.desc";
const SORT_DATE_ASC = "primary_release_date.asc";
const SORT_DATE_DESC = "primary_release_date.desc";

function addNavigationButtons() {
  nextBtn.addEventListener("click", () => {
    if (pageNumber < totalPages) {
      pageNumber++;
      showMovies(pageNumber, currentState);
    }
  });

  backBtn.addEventListener("click", () => {
    if (pageNumber > 1) {
      pageNumber--;
      showMovies(pageNumber, currentState);
    }
  });
}

function addPopularityButton() {
  ratingToggle.addEventListener("click", (e) => {
    currentState = currentState === "desc" ? "asc" : "desc";
    pageNumber = 1;
    SORT_ASC = "popularity.asc";
    SORT_DESC = "popularity.desc";
    showMovies(pageNumber, currentState);
    e.target.innerText =
      currentState === "desc" ? SORT_DESC_TEXT : SORT_ASC_TEXT;
  });
  sortByDate.addEventListener("click",(e)=>{
    currentStateDate = currentStateDate === "desc" ? "asc" : "desc";
    pageNumber = 1;
    SORT_ASC = "primary_release_date.asc";
    SORT_DESC = "primary_release_date.desc";
    showMovies(pageNumber, currentStateDate);
    e.target.innerText = currentStateDate === "desc" ? SORT_DESC_DATE_TEXT : SORT_ASC_DATE_TEXT;

  })
}

async function showMovies(pageNumber = 1, sort_by = "desc") {
  movieListSection.innerText = "";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTk2Nzc5YmYxODJmOWY3ZTZjZGNkYjM2MWM5YzJlNSIsInN1YiI6IjY0ZDYzM2U5ZGI0ZWQ2MDEzOTU5YjIwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2wRn2jZftjLdeYL4DP_JhcaDnmAhnKzebuaJd4NcJMA",
    },
  };
  let response;
  if(!searchMode){
    response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${pageNumber}&sort_by=${
      sort_by === "asc" ? SORT_ASC : SORT_DESC
    }`,
    options
  );
  }
  else{
    response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchInput.value.trim().toLowerCase()}&include_adult=false&language=en-US&page=${pageNumber}`, options);
  }

  const json = await response.json();
  totalPages = json.total_pages;
  const movieList = json.results;
  for (let movie of movieList) {
    // movie section
    const movieTitle = document.createElement("h2");
    movieTitle.innerText = movie.title;
    const rating = document.createElement("p");
    rating.textContent = movie.vote_average;
    const movieDetails = document.createElement("section");
    movieDetails.appendChild(movieTitle);
    
    movieDetails.classList.add("movie-details");
    // image/ banner
    let banner = document.createElement("img");
    banner.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    banner.classList.add("movie-poster");
    // footer
    const footer = document.createElement("footer");
    const date = document.createElement("p");
    date.innerText = `date ${movie.release_date}`;
    const heart = document.createElement("i");
    heart.classList.add("fa-regular", "fa-heart", "like");
    footer.appendChild(rating);
    footer.appendChild(date);
    footer.appendChild(heart);
    // parent
    const movieElement = document.createElement("article");
    movieElement.classList.add("movie");
    movieElement.appendChild(banner);
    movieElement.appendChild(movieTitle);
    movieElement.appendChild(footer);
    movieListSection.appendChild(movieElement);
    pageNumberContainer.innerText = "Current Page: " + pageNumber;
  }
  if(pageNumber === 1){
    backBtn.setAttribute("disabled",true);
  }
  else if(pageNumber === 3){
    nextBtn.setAttribute("disabled",true);
  }
  else if(pageNumber > 1 && pageNumber <= 3){
    backBtn.removeAttribute("disabled");
    nextBtn.removeAttribute("disabled");
  }
  //   movieList
}

function addSearchButtonFunctionality(){
  searchMode = true;
  currentState = currentState === "desc" ? "asc" : "desc";
    pageNumber = 1;
    SORT_ASC = "popularity.asc";
    SORT_DESC = "popularity.desc";
  showMovies(pageNumber,currentState)
}

searchBtn.addEventListener("click",()=>{
  addSearchButtonFunctionality();
  if(searchInput.value === ""){
  searchMode = false;
  pageNumber = 1;
  }
})

async function init() {
  pageNumber = 1;
  await showMovies(1);
  addNavigationButtons();
  addPopularityButton();
}

// application code
init();
