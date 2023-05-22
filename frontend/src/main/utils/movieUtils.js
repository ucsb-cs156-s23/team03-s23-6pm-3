// get movies from local storage
const get = () => {
    const movieValue = localStorage.getItem("movies");
    if (movieValue === undefined) {
        const movieCollection = { nextId: 1, movies: [] }
        return set(movieCollection);
    }
    const movieCollection = JSON.parse(movieValue);
    if (movieCollection === null) {
        const movieCollection = { nextId: 1, movies: [] }
        return set(movieCollection);
    }
    return movieCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const movieCollection = get();
    const movies = movieCollection.movies;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = movies.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `movie with id ${id} not found` };
    }
    return { movie: movies[index] };
}

// set movies in local storage
const set = (movieCollection) => {
    localStorage.setItem("movies", JSON.stringify(movieCollection));
    return movieCollection;
};

// add a movie to local storage
const add = (movie) => {
    const movieCollection = get();
    movie = { ...movie, id: movieCollection.nextId };
    movieCollection.nextId++;
    movieCollection.movies.push(movie);
    set(movieCollection);
    return movie;
};

// update a movie in local storage
const update = (movie) => {
    const movieCollection = get();

    const movies = movieCollection.movies;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = movies.findIndex((r) => r.id == movie.id);
    if (index === -1) {
        return { "error": `movie with id ${movie.id} not found` };
    }
    movies[index] = movie;
    set(movieCollection);
    return { movieCollection: movieCollection };
};

// delete a movie from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const movieCollection = get();
    const movies = movieCollection.movies;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = movies.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `movie with id ${id} not found` };
    }
    movies.splice(index, 1);
    set(movieCollection);
    return { movieCollection: movieCollection };
};

const movieUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { movieUtils };


