import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MovieDetailsPage from "main/pages/Movies/MovieDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { movieFixtures } from "fixtures/movieFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 1,
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});

describe("MovieDetailsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MovieTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/movies").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/movies").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders one movie without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/movies", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Name1",
            starring: "Starring1",
            director: "Director1",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent(
            "Name1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-starring`)
        ).toHaveTextContent("Starring1");
        expect(
            getByTestId(`${testId}-cell-row-0-col-director`)
        ).toHaveTextContent("Director1");
        expect(
            getByTestId(`${testId}-cell-row-0-col-director`)
        ).toHaveTextContent("Director1");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders one movie without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/movies", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Name1",
            starring: "Starring1",
            director: "Director1",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent(
            "Name1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-starring`)
        ).toHaveTextContent("Starring1");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/movies").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
        });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch(
            "Error communicating with backend via GET on /api/movies"
        );
        restoreConsole();

        expect(
            queryByTestId(`${testId}-cell-row-0-col-id`)
        ).not.toBeInTheDocument();
    });
});
