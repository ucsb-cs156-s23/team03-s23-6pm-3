import {
    fireEvent,
    queryByTestId,
    render,
    waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SongEditPage from "main/pages/Songs/SongEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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
            id: 17,
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});
describe("SongEditPage tests", () => {
    describe("when the backend doesn't return a todo", () => {
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
            axiosMock.onGet("/api/song", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SongEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Song");
            expect(queryByTestId("SongForm-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {
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
            axiosMock.onGet("/api/song", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "Title1",
                artist: "Artist1",
                album: "Album1",
            });
            axiosMock.onPut("/api/song").reply(200, {
                id: "17",
                title: "Title2",
                artist: "Artist2",
                album: "Album2",
            });
        });

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

        test("Is populated with the data provided", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SongEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SongForm-title");

            const idField = getByTestId("SongForm-id");
            const titleField = getByTestId("SongForm-title");
            const artistField = getByTestId("SongForm-artist");
            const albumField = getByTestId("SongForm-album");
            const submitButton = getByTestId("SongForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Title1");
            expect(artistField).toHaveValue("Artist1");
            expect(albumField).toHaveValue("Album1");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SongEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SongForm-title");

            const idField = getByTestId("SongForm-id");
            const titleField = getByTestId("SongForm-title");
            const artistField = getByTestId("SongForm-artist");
            const albumField = getByTestId("SongForm-album");
            const submitButton = getByTestId("SongForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Title1");
            expect(artistField).toHaveValue("Artist1");
            expect(albumField).toHaveValue("Album1");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: "Title2" } });
            fireEvent.change(artistField, {
                target: { value: "Artist2" },
            });
            fireEvent.change(albumField, { target: { value: "Album2" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith(
                "Song Updated - id: 17 title: Title2"
            );
            expect(mockNavigate).toBeCalledWith({ to: "/songs/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(
                JSON.stringify({
                    title: "Title2",
                    artist: "Artist2",
                    album: "Album2",
                })
            ); // posted object
        });
    });
});
