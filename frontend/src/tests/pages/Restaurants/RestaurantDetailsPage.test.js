// import { fireEvent, render, waitFor } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";
// import mockConsole from "jest-mock-console";

// const mockToast = jest.fn();
// jest.mock("react-toastify", () => {
//     const originalModule = jest.requireActual("react-toastify");
//     return {
//         __esModule: true,
//         ...originalModule,
//         toast: (x) => mockToast(x),
//     };
// });

// describe("RestaurantDetailsPage tests", () => {
//     const axiosMock = new AxiosMockAdapter(axios);

//     const testId = "RestaurantTable";

//     const setupUserOnly = () => {
//         axiosMock.reset();
//         axiosMock.resetHistory();
//         axiosMock
//             .onGet("/api/currentUser")
//             .reply(200, apiCurrentUserFixtures.userOnly);
//         axiosMock
//             .onGet("/api/systemInfo")
//             .reply(200, systemInfoFixtures.showingNeither);
//     };

//     const setupAdminUser = () => {
//         axiosMock.reset();
//         axiosMock.resetHistory();
//         axiosMock
//             .onGet("/api/currentUser")
//             .reply(200, apiCurrentUserFixtures.adminUser);
//         axiosMock
//             .onGet("/api/systemInfo")
//             .reply(200, systemInfoFixtures.showingNeither);
//     };

//     test("renders without crashing for regular user", () => {
//         setupUserOnly();
//         const queryClient = new QueryClient();
//         axiosMock.onGet("/api/restaurants").reply(200, []);

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("renders without crashing for admin user", () => {
//         setupAdminUser();
//         const queryClient = new QueryClient();
//         axiosMock.onGet("/api/restaurants").reply(200, []);

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("renders one restaurants without crashing for regular user", async () => {
//         setupUserOnly();
//         const queryClient = new QueryClient();
//         axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).reply(200, {
//             id: 17,
//             name: "Name1",
//             description: "Description1",
//             location: "Location1",
//         });

//         const { getByTestId } = render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         await waitFor(() => {
//             expect(
//                 getByTestId(`${testId}-cell-row-0-col-id`)
//             ).toHaveTextContent("17");
//         });
//         expect(getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent(
//             "Name1"
//         );
//         expect(
//             getByTestId(`${testId}-cell-row-0-col-description`)
//         ).toHaveTextContent("Description1");
//         expect(
//             getByTestId(`${testId}-cell-row-0-col-location`)
//         ).toHaveTextContent("Location1");
//     });

//     test("renders empty table when backend unavailable, user only", async () => {
//         setupUserOnly();

//         const queryClient = new QueryClient();
//         axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).reply(200, {
//             id: 17,
//             name: "Name1",
//             description: "Description1",
//             location: "Location1",
//         });

//         const restoreConsole = mockConsole();

//         const { queryByTestId } = render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         await waitFor(() => {
//             expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
//         });

//         const errorMessage = console.error.mock.calls[0][0];
//         expect(errorMessage).toMatch(
//             "Error communicating with backend via GET on /api/restaurants"
//         );
//         restoreConsole();

//         expect(
//             queryByTestId(`${testId}-cell-row-0-col-id`)
//         ).not.toBeInTheDocument();
//     });
// });
