import { render, waitFor, fireEvent } from "@testing-library/react";
import SongCreatePage from "main/pages/Songs/SongCreatePage";
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

describe("SongCreatePage tests", () => {
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
                    <SongCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
        const queryClient = new QueryClient();
        const song = {
            id: 1,
            title: "Title1",
            artist: "Artist1",
            album: "Album1",
        };

        axiosMock.onPost("/api/song/post").reply(202, song);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("SongForm-title")).toBeInTheDocument();
        });

        const titleField = getByTestId("SongForm-title");
        const artistField = getByTestId("SongForm-artist");
        const albumField = getByTestId("SongForm-album");
        const submitButton = getByTestId("SongForm-submit");

        fireEvent.change(titleField, { target: { value: "Title1" } });
        fireEvent.change(artistField, {
            target: { value: "Artist1" },
        });
        fireEvent.change(albumField, {
            target: { value: "Album1" },
        });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            title: "Title1",
            artist: "Artist1",
            album: "Album1",
        });

        expect(mockToast).toBeCalledWith(
            "New song created - id: 1 title: Title1"
        );
        expect(mockNavigate).toBeCalledWith({ to: "/songs/list" });
    });
});
