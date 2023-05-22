import {
    fireEvent,
    queryByTestId,
    render,
    waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

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

describe("RestaurantEditPage tests", () => {
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
            axiosMock
                .onGet("/api/restaurants", { params: { id: 17 } })
                .timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Restaurant");
            expect(
                queryByTestId("RestaurantForm-name")
            ).not.toBeInTheDocument();
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
            axiosMock
                .onGet("/api/restaurants", { params: { id: 17 } })
                .reply(200, {
                    id: 17,
                    name: "Name1",
                    description: "Description1",
                    location: "Location1",
                });
            axiosMock.onPut("/api/restaurants").reply(200, {
                id: "17",
                name: "Name2",
                description: "Description2",
                location: "Location2",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const locationField = getByTestId("RestaurantForm-location");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Name1");
            expect(descriptionField).toHaveValue("Description1");
            expect(locationField).toHaveValue("Location1");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const locationField = getByTestId("RestaurantForm-location");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Name1");
            expect(descriptionField).toHaveValue("Description1");
            expect(locationField).toHaveValue("Location1");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: "Name2" } });
            fireEvent.change(descriptionField, {
                target: { value: "Description2" },
            });
            fireEvent.change(locationField, { target: { value: "Location2" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith(
                "Restaurant Updated - id: 17 name: Name2"
            );
            expect(mockNavigate).toBeCalledWith({ to: "/restaurants/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(
                JSON.stringify({
                    name: "Name2",
                    description: "Description2",
                    location: "Location2",
                })
            ); // posted object
        });
    });
});
