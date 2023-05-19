import { songFixtures } from "fixtures/songFixtures";
import { songUtils } from "main/utils/songUtils";

describe("songUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "songs".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "songs") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When songs is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.get();

            // assert
            const expected = { nextId: 1, songs: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("songs", expectedJSON);
        });

        test("When songs is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.get();

            // assert
            const expected = { nextId: 1, songs: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("songs", expectedJSON);
        });

        test("When songs is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, songs: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.get();

            // assert
            const expected = { nextId: 1, songs: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When songs is JSON of three songs, should return that JSON", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;
            const mockSongCollection = { nextId: 10, songs: threeSongs };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockSongCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.get();

            // assert
            expect(result).toEqual(mockSongCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a song by id works", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;
            const idToGet = threeSongs[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            // act
            const result = songUtils.getById(idToGet);

            // assert

            const expected = { song: threeSongs[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing song returns an error", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            // act
            const result = songUtils.getById(99);

            // assert
            const expectedError = `song with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            // act
            const result = songUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one song works", () => {

            // arrange
            const song = songFixtures.oneSong[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, songs: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.add(song);

            // assert
            expect(result).toEqual(song);
            expect(setItemSpy).toHaveBeenCalledWith("songs",
                JSON.stringify({ nextId: 2, songs: songFixtures.oneSong }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing song works", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;
            const updatedSong = {
                ...threeSongs[0],
                name: "Updated Name"
            };
            const threeSongsUpdated = [
                updatedSong,
                threeSongs[1],
                threeSongs[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.update(updatedSong);

            // assert
            const expected = { songCollection: { nextId: 5, songs: threeSongsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("songs", JSON.stringify(expected.songCollection));
        });
        test("Check that updating an non-existing song returns an error", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedSong = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = songUtils.update(updatedSong);

            // assert
            const expectedError = `song with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a song by id works", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;
            const idToDelete = threeSongs[1].id;
            const threeSongsUpdated = [
                threeSongs[0],
                threeSongs[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.del(idToDelete);

            // assert

            const expected = { songCollection: { nextId: 5, songs: threeSongsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("songs", JSON.stringify(expected.songCollection));
        });
        test("Check that deleting a non-existing song returns an error", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = songUtils.del(99);

            // assert
            const expectedError = `song with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeSongs = songFixtures.threeSongs;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, songs: threeSongs }));

            // act
            const result = songUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

