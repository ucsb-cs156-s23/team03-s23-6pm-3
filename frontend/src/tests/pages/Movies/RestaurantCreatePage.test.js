import { render, waitFor, fireEvent } from "@testing-library/react";
import MovieCreatePage from "main/pages/Movies/MovieCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});

describe("MovieCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
        const queryClient = new QueryClient();
        const movie = {
            id: 1,
            name: "Name1",
            starring: "Starring1",
            director: "Director1",
        };

        axiosMock.onPost("/api/movies/post").reply(202, movie);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("MovieForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("MovieForm-name");
        const starringField = getByTestId("MovieForm-starring");
        const directorField = getByTestId("MovieForm-director");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.change(nameField, { target: { value: "Name1" } });
        fireEvent.change(starringField, {
            target: { value: "Starring1" },
        });
        fireEvent.change(directorField, {
            target: { value: "Director1" },
        });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            name: "Name1",
            starring: "Starring1",
            director: "Director1",
        });

        expect(mockToast).toBeCalledWith(
            "New movie created - id: 1 name: Name1"
        );
        expect(mockNavigate).toBeCalledWith({ to: "/movies/list" });
    });
});
