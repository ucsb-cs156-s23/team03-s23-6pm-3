import { render, screen } from "@testing-library/react";
import SongDetailsPage from "main/pages/Songs/SongDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/songUtils', () => {
    return {
        __esModule: true,
        songUtils: {
            getById: (_id) => {
                return {
                    song: {
                        id: 3,
                        title: "Love Story",
                        artist: "Taylor Swift",
                        album: "Fearless",
                    }
                }
            }
        }
    }
});

describe("SongDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Love Story")).toBeInTheDocument();
        expect(screen.getByText("Taylor Swift")).toBeInTheDocument();
        expect(screen.getByText("Fearless")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


