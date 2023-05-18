import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import SongEditPage from "main/pages/Songs/SongEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/songUtils', () => {
    return {
        __esModule: true,
        songUtils: {
            update: (_song) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    song: {
                        id: 3,
                        title: "Love Story",
                        artist: "Taylor Swift",
                        album: "Fearless"
                    }
                }
            }
        }
    }
});


describe("SongEditPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("SongForm-title")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Love Story')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Taylor Swift')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Fearless')).toBeInTheDocument();
    });

    test("redirects to /songs on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "song": {
                id: 3,
                title: "Love Story (extended)",
                artist: "T swizzle",
                album: "not scared"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();


        const artistInput = screen.getByLabelText("Artist");
        expect(artistInput).toBeInTheDocument();

        const albumInput = screen.getByLabelText("Album");
        expect(albumInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Love Story (extended)' } })
            fireEvent.change(artistInput, { target: { value: 'T swizzle' } })
            fireEvent.change(albumInput, { target: { value: 'not scared' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/songs/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedSong: {"song":{"id":3,"title":"Love Story (extended)","artist":"T swizzle","album":"not scared"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

