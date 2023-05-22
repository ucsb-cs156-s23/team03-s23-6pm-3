import { movieFixtures } from "fixtures/movieFixtures";
import { movieUtils } from "main/utils/movieUtils";

describe("movieUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "movies".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "movies") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When movies is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.get();

            // assert
            const expected = { nextId: 1, movies: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("movies", expectedJSON);
        });

        test("When movies is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.get();

            // assert
            const expected = { nextId: 1, movies: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("movies", expectedJSON);
        });

        test("When movies is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, movies: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.get();

            // assert
            const expected = { nextId: 1, movies: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When movies is JSON of three movies, should return that JSON", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;
            const mockMovieCollection = { nextId: 10, movies: threeMovies };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockMovieCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.get();

            // assert
            expect(result).toEqual(mockMovieCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a movie by id works", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;
            const idToGet = threeMovies[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            // act
            const result = movieUtils.getById(idToGet);

            // assert

            const expected = { movie: threeMovies[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing movie returns an error", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            // act
            const result = movieUtils.getById(99);

            // assert
            const expectedError = `movie with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            // act
            const result = movieUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one movie works", () => {

            // arrange
            const movie = movieFixtures.oneMovie[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, movies: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.add(movie);

            // assert
            expect(result).toEqual(movie);
            expect(setItemSpy).toHaveBeenCalledWith("movies",
                JSON.stringify({ nextId: 2, movies: movieFixtures.oneMovie }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing movie works", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;
            const updatedMovie = {
                ...threeMovies[0],
                name: "Updated Name"
            };
            const threeMoviesUpdated = [
                updatedMovie,
                threeMovies[1],
                threeMovies[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.update(updatedMovie);

            // assert
            const expected = { movieCollection: { nextId: 5, movies: threeMoviesUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("movies", JSON.stringify(expected.movieCollection));
        });
        test("Check that updating an non-existing movie returns an error", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedMovie = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = movieUtils.update(updatedMovie);

            // assert
            const expectedError = `movie with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a movie by id works", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;
            const idToDelete = threeMovies[1].id;
            const threeMoviesUpdated = [
                threeMovies[0],
                threeMovies[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.del(idToDelete);

            // assert

            const expected = { movieCollection: { nextId: 5, movies: threeMoviesUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("movies", JSON.stringify(expected.movieCollection));
        });
        test("Check that deleting a non-existing movie returns an error", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = movieUtils.del(99);

            // assert
            const expectedError = `movie with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeMovies = movieFixtures.threeMovies;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, movies: threeMovies }));

            // act
            const result = movieUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});
