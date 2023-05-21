import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import SongIndexPage from "main/pages/Songs/SongIndexPage";
import SongCreatePage from "main/pages/Songs/SongCreatePage";
import SongEditPage from "main/pages/Songs/SongEditPage";
import SongDetailsPage from "main/pages/Songs/SongDetailsPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
    const { data: currentUser } = useCurrentUser();

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/profile" element={<ProfilePage />} />
                {hasRole(currentUser, "ROLE_ADMIN") && (
                    <Route
                        exact
                        path="/admin/users"
                        element={<AdminUsersPage />}
                    />
                )}
                {hasRole(currentUser, "ROLE_USER") && (
                    <>
                        <Route
                            exact
                            path="/todos/list"
                            element={<TodosIndexPage />}
                        />
                        <Route
                            exact
                            path="/todos/create"
                            element={<TodosCreatePage />}
                        />
                        <Route
                            exact
                            path="/todos/edit/:todoId"
                            element={<TodosEditPage />}
                        />
                    </>
                )}

                {hasRole(currentUser, "ROLE_USER") && (
                    <>
                        <Route
                            exact
                            path="/ucsbdates/list"
                            element={<UCSBDatesIndexPage />}
                        />
                    </>
                )}
                {hasRole(currentUser, "ROLE_ADMIN") && (
                    <>
                        <Route
                            exact
                            path="/ucsbdates/edit/:id"
                            element={<UCSBDatesEditPage />}
                        />
                        <Route
                            exact
                            path="/ucsbdates/create"
                            element={<UCSBDatesCreatePage />}
                        />
                    </>
                )}

                {hasRole(currentUser, "ROLE_USER") && (
                    <>
                        <Route
                            exact
                            path="/songs/list"
                            element={<SongIndexPage />}
                        />
                    </>
                )}
                {hasRole(currentUser, "ROLE_ADMIN") && (
                    <>
                        <Route
                            exact
                            path="/songs/edit/:id"
                            element={<SongEditPage />}
                        />
                        <Route
                            exact
                            path="/songs/create"
                            element={<SongCreatePage />}
                        />
                        <Route
                            exact
                            path="/songs/details/:id"
                            element={<SongDetailsPage />}
                        />
                    </>
                )}

                {hasRole(currentUser, "ROLE_USER") && (
                    <>
                        <Route
                            exact
                            path="/restaurants/list"
                            element={<RestaurantIndexPage />}
                        />
                    </>
                )}
                {hasRole(currentUser, "ROLE_ADMIN") && (
                    <>
                        <Route
                            exact
                            path="/restaurants/edit/:id"
                            element={<RestaurantEditPage />}
                        />
                        <Route
                            exact
                            path="/restaurants/create"
                            element={<RestaurantCreatePage />}
                        />
                        <Route
                            exact
                            path="/restaurants/details/:id"
                            element={<RestaurantDetailsPage />}
                        />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
