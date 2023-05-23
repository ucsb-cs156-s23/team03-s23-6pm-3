import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MovieTable from "main/components/Movies/MovieTable";
import { useCurrentUser } from "main/utils/currentUser";

export default function MovieIndexPage() {
    const currentUser = useCurrentUser();

    const {
        data: movies,
        error: _error,
        status: _status,
    } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/movies/all"],
        { method: "GET", url: "/api/movies/all" },
        []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Movies</h1>
                <MovieTable movies={movies} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}
