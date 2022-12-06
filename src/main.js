const API_URL = "https://api.themoviedb.org/3";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    params: {
        api_key: API_KEY,
    },
});

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute("data-img");
            entry.target.setAttribute("src", url);
        }
    });
});

function createMovies(movies, container, { lazyLoad = false, clean = true }) {
    if (clean) {
        container.innerHTML = "";
    }

    movies.forEach((movie) => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");
        movieContainer.addEventListener("click", () => {
            location.hash = "#movie=" + movie.id;
        });

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        //movieImg.classList.add("img-responsive");
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute(
            lazyLoad ? "data-img" : "src",
            `https://image.tmdb.org/t/p/w300` + movie.poster_path
        );

        movieImg.addEventListener("error", () => {
            movieImg.setAttribute(
                "src",
                "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
            );
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach((category) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");

        const categoryTitle = document.createElement("h3");
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id", "id" + category.id);
        categoryTitle.addEventListener("click", () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTittleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTittleText);

        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

// Llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api(`/trending/movie/day`);
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true });
}

async function getCategoriesPreview() {
    const { data } = await api(`/genre/movie/list`);
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id, page = 1) {
    const { data } = await api(`/discover/movie`, {
        params: {
            with_genres: id,
            page,
        },
    });
    const movies = data.results;
    maxpage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: page == 1 });
}

async function getMoviesBySearch(query, page = 1) {
    const { data } = await api(`/search/movie`, {
        params: {
            query,
            page,
        },
    });
    const movies = data.results;
    maxpage = data.total_pages;

    createMovies(movies, genericSection, {
        lazyLoad: true,
        clean: page == 1,
    });
}

async function getTrendingMovies(page = 1) {
    const { data } = await api(`/trending/movie/day`, {
        params: {
            page,
        },
    });

    const movies = data.results;
    maxpage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true, clean: page == 1 });
}

async function getMovieById(id) {
    const { data: movie } = await api(`/movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500` + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
    const { data } = await api(`/movie/${id}/similar`);

    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer, { lazyLoad: true });
}
