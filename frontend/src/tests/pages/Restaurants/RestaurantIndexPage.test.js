import { render, screen, waitFor } from "@testing-library/react";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockDelete = jest.fn();
jest.mock("main/utils/restaurantUtils", () => {
    return {
        __esModule: true,
        restaurantUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    restaurants: [
                        {
                            id: 3,
                            name: "Name3",
                            description: "Description3",
                            location: "Location3",
                        },
                    ],
                };
            },
        },
    };
});

describe("RestaurantIndexPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createRestaurantButton = screen.getByText("Create Restaurant");
        expect(createRestaurantButton).toBeInTheDocument();
        expect(createRestaurantButton).toHaveAttribute(
            "style",
            "float: right;"
        );

        const name = screen.getByText("Name3");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Description3");
        expect(description).toBeInTheDocument();

        const location = screen.getByText("Location3");
        expect(location).toBeInTheDocument();

        expect(
            screen.getByTestId("RestaurantTable-cell-row-0-col-Delete-button")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("RestaurantTable-cell-row-0-col-Details-button")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("RestaurantTable-cell-row-0-col-Edit-button")
        ).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {
        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Name3");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Description3");
        expect(description).toBeInTheDocument();

        const location = screen.getByText("Location3");
        expect(location).toBeInTheDocument();

        const deleteButton = screen.getByTestId(
            "RestaurantTable-cell-row-0-col-Delete-button"
        );
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/restaurants/list")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `RestaurantIndexPage deleteCallback: {"id":3,"name":"Name3","description":"Description3","location":"Location3"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});
