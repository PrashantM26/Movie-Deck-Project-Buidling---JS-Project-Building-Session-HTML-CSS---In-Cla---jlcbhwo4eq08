let pageNumber;
let totalPage = 0;
let sortBtnByReleaseDate = document.querySelector('#sort-date');
let sortBtnByPopularity = document.querySelector('#sort-rate');
let movieList = document.querySelector('#movie-list');
let nextPageBtn = document.querySelector('#next-page');
let prevPageBtn = document.querySelector('#prev-page');
let currPageBtn = document.querySelector('#curr-page');
let showFavoriteMovies = document.querySelector('#show-fav');
let shwoAllMovies = document.querySelector('#show-all');
let favoriteMoviesArray = [];
let sortByProperty = "vote_count.desc";
let searchInput = document.querySelector("#search-bar--input");
// let searchBtn = document.querySelector("#search-bar--button");
let query = "";

searchInput.addEventListener('input',()=>{
   
    query = searchInput.value;
    paginationShow();
    pageNumber = 1;
    if(showFavoriteMovies.classList.contains('active-tab')){
        getData(pageNumber,sortByProperty,favoriteMoviesArray,query);
    }
    else{
        getData(pageNumber,sortByProperty,null,query);
    }
})
function showLikeAndUnlikeEffect(heart){
    heart.classList.add('like-effect')
    setTimeout(()=>{
        heart.classList.remove('like-effect')
    },300)
}

async function getData(pageNumber, sort, customMovieArray = null,query=null){

    movieList.innerHTML = "";
    let result;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGNiMTY3YWY0YjM4MjZlNmIyMzRjOGZmZGI2YTg3ZCIsInN1YiI6IjY0ZDM4NWFmZGI0ZWQ2MDBlMmI0ZjhjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jgY8TgBak84vKO3UJK0mmxDiVWo8W5EHNDoOGqOJQ6o'
        }
    };
    let response;
    let dataObj;
    if(!customMovieArray && !query){

          
        response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=${sort}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
    }
    else{
        result = customMovieArray;
        paginationHide()
    }
    if(query && customMovieArray === null){
        response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
        result.length === 0 ? movieList.innerHTML = `Sorry, No such movie found.` : null
        paginationHide()
    }
    else if(query && customMovieArray !== null){
        result = customMovieArray.filter((movie)=>{
            let regex = new RegExp(query,"i")
            return regex.test(movie.title)
        })
        result.length === 0 ? movieList.innerHTML = `No such movie found in Favorites.` : null
        paginationHide()
    }
    result.forEach((element)=>{
        let movieCard = document.createElement('section');
        movieCard.classList.add('movies-card');
        movieCard.id = element.id;
        movieCard.title = element.title

        // creating poster section
        let poster = document.createElement('section');
        poster.classList.add('poster')
        let moviePoster = document.createElement('img');
        moviePoster.classList.add("movie-poster");
        moviePoster.src = `https://image.tmdb.org/t/p/w300${element.backdrop_path}`;
        moviePoster.alt = "Oops something broke...";
        poster.appendChild(moviePoster);
        //creating title and overview sections
        let movieTitle = document.createElement('h2');
        movieTitle.classList.add("movie-title");
        movieTitle.innerText = element.title;
        // creating footer
        let movieCardFooter = document.createElement('footer');
        movieCardFooter.classList.add("movie-card--footer");

        let movieRating = document.createElement('section');
        movieRating.classList.add("movie-rating");
        let voteCount = document.createElement('p');
        voteCount.classList.add("movie--vote-count")
        voteCount.innerText=`Vote count: ${element.vote_average}` ;
        let averageVote = document.createElement('p');
        averageVote.classList.add("movie--vote-avg");
        averageVote.innerText= `Average vote: ${element.vote_average}`;
        movieRating.appendChild(voteCount);
        movieRating.appendChild(averageVote);

        let favMovie = document.createElement('section');
        favMovie.classList.add('fav-movie');
        let heart = document.createElement('i');
        heart.classList.add('fa-regular','fa-heart','fav-movie-icon');

        if(favoriteMoviesArray.find((currentMovie)=>{
            return currentMovie.id === element.id
        })){
            heart.classList.toggle("fa-regular");
            heart.classList.toggle("fa-solid");
        }
        heart.addEventListener('click',(e)=>{
            favoriteMovieList(heart,element);
            showLikeAndUnlikeEffect(heart)
        })
        favMovie.appendChild(heart);
        movieCardFooter.appendChild(movieRating);
        movieCardFooter.appendChild(favMovie);

        movieCard.appendChild(poster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieCardFooter);
        movieCard.addEventListener('dblclick',(e)=>{
            favoriteMovieList(heart,element)
            showLikeAndUnlikeEffect(heart)
        })

        movieList.appendChild(movieCard)
    })
    
    // Updated current page Number
    currPageBtn.innerText = `Current Page: ${pageNumber}`
}
// Displayed sorted movies by release date
function displaySortByReleaseDate(){
    sortBtnByReleaseDate.addEventListener('click', ()=> {
        
        sortBtnByReleaseDate.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByPopularity.classList.remove('active-tab')
        if(sortByProperty !== "primary_release_date.desc"){
            sortByProperty ="primary_release_date.desc";
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-down">`
        }
        else{
            sortByProperty= 'primary_release_date.asc';
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-up">`
        }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber, sortByProperty);
    })
}
// Displayed sorted movies by popularity
function displaySortByPopularity(){
    sortBtnByPopularity.addEventListener('click', () => {

        sortBtnByPopularity.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByReleaseDate.classList.remove('active-tab')
        if(sortByProperty === "vote_count.desc"){
            sortByProperty = "vote_count.asc"
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-up">`
        }
        else{
            sortByProperty="vote_count.desc";
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-down">`
        }
        sortBtnByReleaseDate.innerHTML = `Sort By date`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);
    })
}
// Showed All Movies when clicked on All button
function displayAllMovies(){
    shwoAllMovies.addEventListener('click',()=>{
        // if(!shwoAllMovies.classList.contains('active-tab')){
            shwoAllMovies.classList.add('active-tab');
            showFavoriteMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        sortByProperty="vote_count.desc"
        // pageNumber = 1;
        paginationShow();
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);

    })
};

// Added and Removed Favorite movies in an Array of Favorite movies
function favoriteMovieList(target,movie){
    target.classList.toggle("fa-regular");
    target.classList.toggle('fa-solid');
    if(target.classList.contains('fa-solid')){
        favoriteMoviesArray.unshift(movie);
    }
    else{
        favoriteMoviesArray = favoriteMoviesArray.filter((currentMovie)=>{
            return currentMovie.id !== movie.id
        })
    }
    localStorage.setItem('favMovies',JSON.stringify(favoriteMoviesArray))
};
// Displayed Favorite Movies when clicked on Favorite button
function displayFavoriteMovies(){

    showFavoriteMovies.addEventListener('click',()=>{
        paginationHide()
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        // if(!showFavoriteMovies.classList.contains('active-tab')){
            showFavoriteMovies.classList.add('active-tab');
            shwoAllMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        if(favoriteMoviesArray.length == 0){
            movieList.innerHTML = "No movies added to your favorites yet";
            return;
        }
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty,favoriteMoviesArray)
        
    })
};
// Loaded Next or Previous page
function addNavigationButtons(){

    // Loaded next page
    nextPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if(totalPage > pageNumber){
            pageNumber++;
            getData(pageNumber,sortByProperty,null,query)
        }
        
    });
    // Loaded previous page
    prevPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if (pageNumber > 1 ){
            pageNumber--;
            getData(pageNumber,sortByProperty,null,query)
        }

    })
};
function paginationHide(){
    nextPageBtn.style.visibility = 'hidden'
    prevPageBtn.style.visibility = 'hidden'
    currPageBtn.style.visibility = 'hidden'
}
function paginationShow(){
    nextPageBtn.style.visibility = 'visible'
    prevPageBtn.style.visibility = 'visible'
    currPageBtn.style.visibility = 'visible'
}

// Initialized the page
async function init(){
    pageNumber = 1;
    favoriteMoviesArray = localStorage.getItem("favMovies")
    ? JSON.parse(localStorage.getItem("favMovies"))
    : [];
    await getData(1,sortByProperty);
    displaySortByReleaseDate()
    displaySortByPopularity()
    addNavigationButtons();
    displayFavoriteMovies();
    displayAllMovies();
};
init();

/*let pageNumber;
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
init();*/

/*let pageNumber;
let totalPage = 0;
let sortBtnByReleaseDate = document.querySelector('#sort-date');
let sortBtnByPopularity = document.querySelector('#sort-rate');
let movieList = document.querySelector('#movie-list');
let nextPageBtn = document.querySelector('#next-page');
let prevPageBtn = document.querySelector('#prev-page');
let currPageBtn = document.querySelector('#curr-page');
let showFavoriteMovies = document.querySelector('#show-fav');
let shwoAllMovies = document.querySelector('#show-all');
let favoriteMoviesArray = [];
let sortByProperty = "vote_count.desc";
let searchInput = document.querySelector("#search-bar--input");
// let searchBtn = document.querySelector("#search-bar--button");
let query = "";

searchInput.addEventListener('input',()=>{
   
    query = searchInput.value;
    paginationShow();
    pageNumber = 1;
    if(showFavoriteMovies.classList.contains('active-tab')){
        getData(pageNumber,sortByProperty,favoriteMoviesArray,query);
    }
    else{
        getData(pageNumber,sortByProperty,null,query);
    }
})
function showLikeAndUnlikeEffect(heart){
    heart.classList.add('like-effect')
    setTimeout(()=>{
        heart.classList.remove('like-effect')
    },300)
}

async function getData(pageNumber, sort, customMovieArray = null,query=null){

    movieList.innerHTML = "";
    let result;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGNiMTY3YWY0YjM4MjZlNmIyMzRjOGZmZGI2YTg3ZCIsInN1YiI6IjY0ZDM4NWFmZGI0ZWQ2MDBlMmI0ZjhjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jgY8TgBak84vKO3UJK0mmxDiVWo8W5EHNDoOGqOJQ6o'
        }
    };
    let response;
    let dataObj;
    if(!customMovieArray && !query){

          
        response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=${sort}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
    }
    else{
        result = customMovieArray;
        paginationHide()
    }
    if(query && customMovieArray === null){
        response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`, options)
        dataObj = await response.json();
        totalPage = dataObj.total_pages;
        result = dataObj.results;
        result.length === 0 ? movieList.innerHTML = `Sorry, No such movie found.` : null
        paginationHide()
    }
    else if(query && customMovieArray !== null){
        result = customMovieArray.filter((movie)=>{
            let regex = new RegExp(query,"i")
            return regex.test(movie.title)
        })
        result.length === 0 ? movieList.innerHTML = `No such movie found in Favorites.` : null
        paginationHide()
    }
    result.forEach((element)=>{
        let movieCard = document.createElement('section');
        movieCard.classList.add('movies-card');
        movieCard.id = element.id;
        movieCard.title = element.title

        // creating poster section
        let poster = document.createElement('section');
        poster.classList.add('poster')
        let moviePoster = document.createElement('img');
        moviePoster.classList.add("movie-poster");
        moviePoster.src = `https://image.tmdb.org/t/p/w300${element.backdrop_path}`;
        moviePoster.alt = "Oops something broke...";
        poster.appendChild(moviePoster);
        //creating title and overview sections
        let movieTitle = document.createElement('h2');
        movieTitle.classList.add("movie-title");
        movieTitle.innerText = element.title;
        // creating footer
        let movieCardFooter = document.createElement('footer');
        movieCardFooter.classList.add("movie-card--footer");

        let movieRating = document.createElement('section');
        movieRating.classList.add("movie-rating");
        let voteCount = document.createElement('p');
        voteCount.classList.add("movie--vote-count")
        voteCount.innerText=`Vote count: ${element.vote_average}` ;
        let averageVote = document.createElement('p');
        averageVote.classList.add("movie--vote-avg");
        averageVote.innerText= `Average vote: ${element.vote_average}`;
        movieRating.appendChild(voteCount);
        movieRating.appendChild(averageVote);

        let favMovie = document.createElement('section');
        favMovie.classList.add('fav-movie');
        let heart = document.createElement('i');
        heart.classList.add('fa-regular','fa-heart','fav-movie-icon');

        if(favoriteMoviesArray.find((currentMovie)=>{
            return currentMovie.id === element.id
        })){
            heart.classList.toggle("fa-regular");
            heart.classList.toggle("fa-solid");
        }
        heart.addEventListener('click',(e)=>{
            favoriteMovieList(heart,element);
            showLikeAndUnlikeEffect(heart)
        })
        favMovie.appendChild(heart);
        movieCardFooter.appendChild(movieRating);
        movieCardFooter.appendChild(favMovie);

        movieCard.appendChild(poster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieCardFooter);
        movieCard.addEventListener('dblclick',(e)=>{
            favoriteMovieList(heart,element)
            showLikeAndUnlikeEffect(heart)
        })

        movieList.appendChild(movieCard)
    })
    
    // Updated current page Number
    currPageBtn.innerText = `Current Page: ${pageNumber}`
}
// Displayed sorted movies by release date
function displaySortByReleaseDate(){
    sortBtnByReleaseDate.addEventListener('click', ()=> {
        
        sortBtnByReleaseDate.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByPopularity.classList.remove('active-tab')
        if(sortByProperty !== "primary_release_date.desc"){
            sortByProperty ="primary_release_date.desc";
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-down">`
        }
        else{
            sortByProperty= 'primary_release_date.asc';
            sortBtnByReleaseDate.innerHTML = `Sort By Date <i class="fa-solid fa-arrow-up">`
        }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber, sortByProperty);
    })
}
// Displayed sorted movies by popularity
function displaySortByPopularity(){
    sortBtnByPopularity.addEventListener('click', () => {

        sortBtnByPopularity.classList.add('active-tab')
        showFavoriteMovies.classList.remove('active-tab');
        shwoAllMovies.classList.remove('active-tab');
        sortBtnByReleaseDate.classList.remove('active-tab')
        if(sortByProperty === "vote_count.desc"){
            sortByProperty = "vote_count.asc"
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-up">`
        }
        else{
            sortByProperty="vote_count.desc";
            sortBtnByPopularity.innerHTML = `Sort By Rating <i class="fa-solid fa-arrow-down">`
        }
        sortBtnByReleaseDate.innerHTML = `Sort By date`
        paginationShow();
        pageNumber = 1;
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);
    })
}
// Showed All Movies when clicked on All button
function displayAllMovies(){
    shwoAllMovies.addEventListener('click',()=>{
        // if(!shwoAllMovies.classList.contains('active-tab')){
            shwoAllMovies.classList.add('active-tab');
            showFavoriteMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        sortByProperty="vote_count.desc"
        // pageNumber = 1;
        paginationShow();
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty);

    })
};

// Added and Removed Favorite movies in an Array of Favorite movies
function favoriteMovieList(target,movie){
    target.classList.toggle("fa-regular");
    target.classList.toggle('fa-solid');
    if(target.classList.contains('fa-solid')){
        favoriteMoviesArray.unshift(movie);
    }
    else{
        favoriteMoviesArray = favoriteMoviesArray.filter((currentMovie)=>{
            return currentMovie.id !== movie.id
        })
    }
    localStorage.setItem('favMovies',JSON.stringify(favoriteMoviesArray))
};
// Displayed Favorite Movies when clicked on Favorite button
function displayFavoriteMovies(){

    showFavoriteMovies.addEventListener('click',()=>{
        paginationHide()
        sortBtnByPopularity.innerHTML = `Sort By Rating`
        sortBtnByReleaseDate.innerHTML = `Sort By Date`
        // if(!showFavoriteMovies.classList.contains('active-tab')){
            showFavoriteMovies.classList.add('active-tab');
            shwoAllMovies.classList.remove('active-tab');
            sortBtnByReleaseDate.classList.remove('active-tab')
            sortBtnByPopularity.classList.remove('active-tab')
        // }
        if(favoriteMoviesArray.length == 0){
            movieList.innerHTML = "No movies added to your favorites yet";
            return;
        }
        query = null;
        searchInput.value="";
        getData(pageNumber,sortByProperty,favoriteMoviesArray)
        
    })
};
// Loaded Next or Previous page
function addNavigationButtons(){

    // Loaded next page
    nextPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if(totalPage > pageNumber){
            pageNumber++;
            getData(pageNumber,sortByProperty,null,query)
        }
        
    });
    // Loaded previous page
    prevPageBtn.addEventListener('click',()=>{
        // let query = searchInput.value;
        if (pageNumber > 1 ){
            pageNumber--;
            getData(pageNumber,sortByProperty,null,query)
        }

    })
};
function paginationHide(){
    nextPageBtn.style.visibility = 'hidden'
    prevPageBtn.style.visibility = 'hidden'
    currPageBtn.style.visibility = 'hidden'
}
function paginationShow(){
    nextPageBtn.style.visibility = 'visible'
    prevPageBtn.style.visibility = 'visible'
    currPageBtn.style.visibility = 'visible'
}

// Initialized the page
async function init(){
    pageNumber = 1;
    favoriteMoviesArray = localStorage.getItem("favMovies")
    ? JSON.parse(localStorage.getItem("favMovies"))
    : [];
    await getData(1,sortByProperty);
    displaySortByReleaseDate()
    displaySortByPopularity()
    addNavigationButtons();
    displayFavoriteMovies();
    displayAllMovies();
};
init();*/
