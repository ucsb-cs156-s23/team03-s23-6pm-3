import { render, screen, waitFor } from "@testing-library/react";
import SongIndexPage from "main/pages/Songs/SongIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/songUtils', () => {
    return {
        __esModule: true,
        songUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    songs: [
                        {
                            "id": 3,
                            "title": "Toxic",
                            "artist": "Britney Spears",
                            "album": "In The Zone",
                        },
                    ]
                }
            }
        }
    }
});


describe("SongIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createSongButton = screen.getByText("Create Song");
        expect(createSongButton).toBeInTheDocument();
        expect(createSongButton).toHaveAttribute("style", "float: right;");

        const title = screen.getByText("Toxic");
        expect(title).toBeInTheDocument();

        const artist = screen.getByText("Britney Spears");
        expect(artist).toBeInTheDocument();

        const album = screen.getByText("In The Zone");
        expect(album).toBeInTheDocument();
        
        expect(screen.getByTestId("SongTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("SongTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("SongTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
            <SongIndexPage />
            </MemoryRouter>
            </QueryClientProvider>
            );
            
            const title = screen.getByText("Toxic");
            expect(title).toBeInTheDocument();
            
            const artist = screen.getByText("Britney Spears");
            expect(artist).toBeInTheDocument();
    
            const album = screen.getByText("In The Zone");
            expect(album).toBeInTheDocument();

        const deleteButton = screen.getByTestId("SongTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/songs"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `SongIndexPage deleteCallback: {"id":3,"title":"Toxic","artist":"Britney Spears","album":"In The Zone"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


