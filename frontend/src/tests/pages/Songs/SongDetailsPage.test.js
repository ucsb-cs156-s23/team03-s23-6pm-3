import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SongDetailsPage from "main/pages/Songs/SongDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { songFixtures } from "fixtures/songFixtures";
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

describe("SongDetailsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "SongTable";

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
        axiosMock.onGet("/api/song").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/song").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders one song without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/song", { params: { id: 1 } }).reply(200, {
            id: 1,
            title: "Title1",
            artist: "Artist1",
            album: "Album1",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
            "Title1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-artist`)
        ).toHaveTextContent("Artist1");
        expect(getByTestId(`${testId}-cell-row-0-col-album`)).toHaveTextContent(
            "Album1"
        );
        expect(getByTestId(`${testId}-cell-row-0-col-album`)).toHaveTextContent(
            "Album1"
        );
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders one song without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/song", { params: { id: 1 } }).reply(200, {
            id: 1,
            title: "Title1",
            artist: "Artist1",
            album: "Album1",
        });

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(
                getByTestId(`${testId}-cell-row-0-col-id`)
            ).toHaveTextContent("1");
        });
        expect(getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
            "Title1"
        );
        expect(
            getByTestId(`${testId}-cell-row-0-col-artist`)
        ).toHaveTextContent("Artist1");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/song").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
        });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch(
            "Error communicating with backend via GET on /api/song"
        );
        restoreConsole();

        expect(
            queryByTestId(`${testId}-cell-row-0-col-id`)
        ).not.toBeInTheDocument();
    });
});
