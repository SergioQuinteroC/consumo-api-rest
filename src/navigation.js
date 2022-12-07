let historyArr = [];

let page = 1;
let maxpage;
let paramsF;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
    location.hash = "#search=" + searchFormInput.value;
});

trendingBtn.addEventListener("click", () => {
    location.hash = "#trends";
});

arrowBtn.addEventListener("click", () => {
    if (historyArr.length > 1) {
        location.hash = historyArr[historyArr.length - 2];
        historyArr.splice(-2, 2);
    } else {
        historyArr.pop();
        location.hash = "#home";
    }
    /*  history.back() */
});

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

const scrollBottomReached = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight - 20;
};

const pageIsNotMax = page < maxpage;

function scrollPage() {
    if (scrollBottomReached() && !pageIsNotMax) {
        page++;
        if (!paramsF) {
            infiniteScroll(page);
        } else {
            infiniteScroll(paramsF, page);
        }
    }
}

function navigator() {
    if (infiniteScroll) {
        window.removeEventListener("scroll", scrollPage, { passive: false });
        paramsF = undefined;
        infiniteScroll = undefined;
        page = 1;
    }

    console.log({ location });
    if (location.hash.startsWith("#trends")) {
        trendsPage();
    } else if (location.hash.startsWith("#search=")) {
        const loc = location.hash;
        const [_, search] = loc.split("=");

        search ? searchPage(search.replaceAll("%20", " ")) : homePage();
    } else if (location.hash.startsWith("#movie=")) {
        const loc = location.hash;
        const [_, id] = loc.split("=");

        movieDetailsPage(id);
    } else if (location.hash.startsWith("#category=")) {
        const loc = location.hash;
        const [id, name] = loc.split("=")[1].split("-");

        categoriesPage(id, name.replace("%20", " "));
    } else {
        homePage();
    }

    /* document.scroll(0, 0); */
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (
        location.hash.startsWith("#trends") ||
        location.hash.startsWith("#search=") ||
        location.hash.startsWith("#movie=") ||
        location.hash.startsWith("#category=")
    ) {
        historyArr.push(location.hash);
    }

    if (infiniteScroll) {
        window.addEventListener("scroll", scrollPage, false);
    }
}

function homePage() {
    console.log("Home");

    switch (lan.value) {
        case "en":
            trendingPreviewTitle.innerHTML = "Trends";
            trendingBtn.innerHTML = "See more";
            categoriesPreviewTitle.innerHTML = "Categories";
            likedTitle.innerHTML = "Favorite movies";
            break;
        case "fr":
            trendingPreviewTitle.innerHTML = "Les tendances";
            trendingBtn.innerHTML = "Voir plus";
            categoriesPreviewTitle.innerHTML = "Catégories";
            likedTitle.innerHTML = "Films préférés";
            break;
        case "pt-BR":
            trendingPreviewTitle.innerHTML = "Tendências";
            trendingBtn.innerHTML = "Ver mais";
            categoriesPreviewTitle.innerHTML = "Categorias";
            likedTitle.innerHTML = "Filmes favoritos";
            break;
        default:
            trendingPreviewTitle.innerHTML = "Tendencias";
            break;
    }

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.add("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.remove("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.remove("inactive");
    likedMoviesSection.classList.remove("inactive");
    categoriesPreviewSection.classList.remove("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.add("inactive");

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage(id, name) {
    console.log("Categories");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    headerCategoryTitle.innerText = name;

    getMoviesByCategory(id);
    paramsF = id;
    infiniteScroll = getMoviesByCategory;
}

function movieDetailsPage(id) {
    console.log("Pelicula!!!");

    headerSection.classList.add("header-container--long");
    // headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.add("inactive");
    movieDetailSection.classList.remove("inactive");

    const [, movieId] = location.hash.split("=");

    getMovieById(id);
    infiniteScroll = () => {};
}
function searchPage(search) {
    console.log("Search!!!");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    getMoviesBySearch(search);
    infiniteScroll = getMoviesBySearch(search);
    paramsF = search;
}
function trendsPage() {
    console.log("Trends");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add("inactive");

    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericSection.classList.remove("inactive");
    movieDetailSection.classList.add("inactive");

    headerCategoryTitle.innerText = "Trending";

    getTrendingMovies();
    infiniteScroll = getTrendingMovies;
    paramsF = undefined;
}
