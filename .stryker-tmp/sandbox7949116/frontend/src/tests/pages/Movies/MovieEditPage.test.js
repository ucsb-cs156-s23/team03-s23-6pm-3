import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import MovieEditPage from "main/pages/Movies/MovieEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/movieUtils', () => {
    return {
        __esModule: true,
        movieUtils: {
            update: (_movie) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    movie: {
                        id: 3,
                        name: "Inception",
                        starring: "Leonardo DiCaprio",
                        director: "Christopher Nolan"
                    }
                }
            }
        }
    }
});


describe("MovieEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("MovieForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Inception')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Leonardo DiCaprio')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Christopher Nolan')).toBeInTheDocument();
    });

    test("redirects to /movies on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "movie": {
                id: 3,
                name: "Inception 2",
                starring: "Danny Devito",
                director: "michael bay"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const starringInput = screen.getByLabelText("Starring");
        expect(starringInput).toBeInTheDocument();

        const directorInput = screen.getByLabelText("Director");
        expect(directorInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Inception 2' } })
            fireEvent.change(starringInput, { target: { value: 'Danny Devito' } })
            fireEvent.change(directorInput, { target: { value: 'michael bay' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedMovie: {"movie":{"id":3,"name":"Inception 2","starring":"Danny Devito","director":"michael bay"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});

