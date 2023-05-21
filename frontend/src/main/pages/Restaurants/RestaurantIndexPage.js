import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantsTable from "main/components/Restaurants/RestaurantTable";
import { useCurrentUser } from "main/utils/currentUser";

export default function RestaurantsIndexPage() {
    const currentUser = useCurrentUser();

    const {
        data: restaurants,
        error: _error,
        status: _status,
    } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/restaurants/all"],
        { method: "GET", url: "/api/restaurants/all" },
        []
    );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Restaurants</h1>
                <RestaurantsTable
                    restaurants={restaurants}
                    currentUser={currentUser}
                />
            </div>
        </BasicLayout>
    );
}
