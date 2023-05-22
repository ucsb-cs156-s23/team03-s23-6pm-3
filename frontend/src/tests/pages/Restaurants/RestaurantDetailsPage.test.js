import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
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

describe("RestaurantDetailsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "RestaurantTable";

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
        axiosMock.onGet("/api/restaurants").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders one restaurant without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock
            .onGet("/api/restaurants")
            .reply(200, restaurantFixtures.oneRestaurant[0]);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
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
            getByTestId(`${testId}-cell-row-0-col-description`)
        ).toHaveTextContent("Description1");
        expect(
            getByTestId(`${testId}-cell-row-0-col-location`)
        ).toHaveTextContent("Location1");
        expect(
            getByTestId(`${testId}-cell-row-0-col-location`)
        ).toHaveTextContent("Location1");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders one restaurant without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock
            .onGet("/api/restaurants")
            .reply(200, restaurantFixtures.oneRestaurant[0]);

        const { getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
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
            getByTestId(`${testId}-cell-row-0-col-description`)
        ).toHaveTextContent("Description1");
        expect(
            queryByTestId(`${testId}-cell-row-0-col-Delete`)
        ).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
        });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch(
            "Error communicating with backend via GET on /api/restaurants"
        );
        restoreConsole();

        expect(
            queryByTestId(`${testId}-cell-row-0-col-id`)
        ).not.toBeInTheDocument();
    });
});
