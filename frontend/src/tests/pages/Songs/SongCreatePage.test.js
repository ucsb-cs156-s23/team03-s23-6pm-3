import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import SongCreatePage from "main/pages/Songs/SongCreatePage";
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
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/songUtils', () => {
    return {
        __esModule: true,
        songUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("SongCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /songs on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "song": {
                id: 3,
                title: "Love Story",
                artist: "Taylor Swift",
                album: "Fearless"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();


        const artistInput = screen.getByLabelText("Artist");
        expect(artistInput).toBeInTheDocument();

        const albumInput = screen.getByLabelText("Album");
        expect(albumInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Love Story' } })
            fireEvent.change(artistInput, { target: { value: 'Taylor Swift' } })
            fireEvent.change(albumInput, { target: { value: 'Fearless' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/songs/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdSong: {"song":{"id":3,"title":"Love Story","artist":"Taylor Swift","album":"Fearless"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


