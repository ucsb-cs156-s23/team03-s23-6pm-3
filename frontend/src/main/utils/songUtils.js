// get songs from local storage
const get = () => {
    const songValue = localStorage.getItem("songs");
    if (songValue === undefined) {
        const songCollection = { nextId: 1, songs: [] }
        return set(songCollection);
    }
    const songCollection = JSON.parse(songValue);
    if (songCollection === null) {
        const songCollection = { nextId: 1, songs: [] }
        return set(songCollection);
    }
    return songCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const songCollection = get();
    const songs = songCollection.songs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = songs.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `song with id ${id} not found` };
    }
    return { song: songs[index] };
}

// set songs in local storage
const set = (songCollection) => {
    localStorage.setItem("songs", JSON.stringify(songCollection));
    return songCollection;
};

// add a song to local storage
const add = (song) => {
    const songCollection = get();
    song = { ...song, id: songCollection.nextId };
    songCollection.nextId++;
    songCollection.songs.push(song);
    set(songCollection);
    return song;
};

// update a song in local storage
const update = (song) => {
    const songCollection = get();

    const songs = songCollection.songs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = songs.findIndex((r) => r.id == song.id);
    if (index === -1) {
        return { "error": `song with id ${song.id} not found` };
    }
    songs[index] = song;
    set(songCollection);
    return { songCollection: songCollection };
};

// delete a song from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const songCollection = get();
    const songs = songCollection.songs;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = songs.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `song with id ${id} not found` };
    }
    songs.splice(index, 1);
    set(songCollection);
    return { songCollection: songCollection };
};

const songUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { songUtils };



